import json
import uvicorn
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI, AssistantEventHandler
from typing_extensions import override
from utils import get_output

from pydantic import BaseModel


class Id(BaseModel):
    id: int


client = OpenAI()

from dotenv import load_dotenv
import os

load_dotenv()

assistant_id = os.getenv("ASSISTANT_ID")

thread_id = ""


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


def parse_messages(messages):
    return [
        {
            "role": "user" if message.assistant_id == None else "bot",
            "content": message.content[0].text.value,
        }
        for message in messages.data
    ]


@app.get("/get_chats")
def get_chats():
    global thread_id
    with open("threads.json", "r") as f:
        threads = json.load(f)

    chats = []
    for chat_id, t_id in threads.items():
        if thread_id == "":
            thread_id = t_id

        messages = client.beta.threads.messages.list(thread_id=t_id)
        chats.append({"id": int(chat_id), "messages": parse_messages(messages)[::-1]})

    return chats


@app.get("/get_messages")
def get_messages():
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    return parse_messages(messages)[::-1]


@app.post("/create_thread")
async def create_thread(id: Id):
    global thread_id
    thread = client.beta.threads.create()

    with open("threads.json", "r") as f:
        threads = json.load(f)
    threads[str(id.id)] = thread.id

    with open("threads.json", "w") as f:
        json.dump(threads, f)

    thread_id = thread.id

    return f"Thread created: {thread.id}"


@app.post("/select_thread")
async def select_thread(id: Id):
    global thread_id
    with open("threads.json", "r") as f:
        threads = json.load(f)

    thread_id = threads[str(id.id)]

    return f"Thread selected: {thread_id}"


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()

    class EventHandler(AssistantEventHandler):
        @override
        def on_event(self, event):
            if event.event == "thread.run.requires_action":
                run_id = event.data.id
                asyncio.create_task(self.handle_requires_action(event.data, run_id))

        async def handle_requires_action(self, data, run_id):
            tool_calls = data.required_action.submit_tool_outputs.tool_calls
            tool_outputs = [get_output(tool_call) for tool_call in tool_calls]

            await self.submit_tool_outputs(tool_outputs, run_id)

        async def submit_tool_outputs(self, tool_outputs, run_id):

            with client.beta.threads.runs.submit_tool_outputs_stream(
                thread_id=self.current_run.thread_id,
                run_id=self.current_run.id,
                tool_outputs=tool_outputs,
                event_handler=EventHandler(),
            ) as stream:
                for text in stream.text_deltas:
                    await ws.send_text(text)
                    print(text, end="", flush=True)
                await ws.send_text("\n")
                print()

    async def get_response(msg):
        global thread_id
        print("Message created at: ", thread_id)
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=msg,
        )

        with client.beta.threads.runs.stream(
            thread_id=thread_id, assistant_id=assistant_id, event_handler=EventHandler()
        ) as stream:
            stream.until_done()

    while True:
        msg = await ws.receive_text()

        await get_response(msg)

        await ws.send_text("[START]")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

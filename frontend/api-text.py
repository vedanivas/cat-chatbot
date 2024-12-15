from openai import OpenAI

client = OpenAI()

CAT_API_KEY = "live_CbyzNkYXLpP4Kn6LaPm7fPyOqW8jbkuX6aJBxxfmMeIfHvIQ1On5z0sAneT4F74g"
assistant_id = "asst_MK1R7RNbvUFobLg2kzngi2Jj"
thread_id = "thread_iOIkn01u2rTkHu5UWn64cY8z"

import requests


def get_cat_image(breed):
    breed_id = breed.lower()[:4]

    url = f"https://api.thecatapi.com/v1/images/search?limit=1&breed_ids={breed_id}&api_key={CAT_API_KEY}"
    response = requests.get(url=url)

    if response.status_code == 200:
        data = response.json()
        image_url = data[0]["url"]
        return f"Here is the URL of the image of a {breed} cat: {image_url}"
    else:
        print(f"Failed to retrieve data: {response.status_code}")

    return None


import json


def get_output(tool_call):
    breed = json.loads(tool_call.function.arguments)["breed"]
    url = get_cat_image(breed)

    return {"tool_call_id": tool_call.id, "output": url}


from typing_extensions import override
from openai import AssistantEventHandler


class EventHandler(AssistantEventHandler):
    @override
    def on_event(self, event):
        # Retrieve events that are denoted with 'requires_action'
        # since these will have our tool_calls
        if event.event == "thread.run.requires_action":
            run_id = event.data.id  # Retrieve the run ID from the event data
            self.handle_requires_action(event.data, run_id)

    def handle_requires_action(self, data, run_id):
        tool_calls = data.required_action.submit_tool_outputs.tool_calls
        tool_outputs = [get_output(tool_call) for tool_call in tool_calls]

        # Submit all tool_outputs at the same time
        self.submit_tool_outputs(tool_outputs, run_id)

    def submit_tool_outputs(self, tool_outputs, run_id):
        # Use the submit_tool_outputs_stream helper
        with client.beta.threads.runs.submit_tool_outputs_stream(
            thread_id=self.current_run.thread_id,
            run_id=self.current_run.id,
            tool_outputs=tool_outputs,
            event_handler=EventHandler(),
        ) as stream:
            for text in stream.text_deltas:
                print(text, end="", flush=True)
            print()


message = client.beta.threads.messages.create(
    thread_id=thread_id,
    role="user",
    content="Give me the image of a Bengal cat and a long paragraph about it.",
)


with client.beta.threads.runs.stream(
    thread_id=thread_id, assistant_id=assistant_id, event_handler=EventHandler()
) as stream:
    stream.until_done()


print("Done!!")

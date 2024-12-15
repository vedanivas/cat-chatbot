import { useState } from "react";
import Message from "./Message";

const ChatWindow = ({ chat, updateChat }) => {
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", content: input };
    const botMessage = { sender: "bot", content: "Thinking..." };

    const newMessages = [...chat.messages, userMessage, botMessage];
    updateChat(newMessages);
    setInput("");

    // Simulate backend call
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_input: input }),
    });
    const data = await response.json();

    // Update bot response
    const updatedMessages = newMessages.map((msg) =>
      msg === botMessage ? { ...msg, content: data.reply } : msg
    );
    updateChat(updatedMessages);
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {chat.messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} content={msg.content} />
        ))}
      </div>
      <div className="input-bar">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;

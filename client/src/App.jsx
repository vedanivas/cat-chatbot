import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./index.css";

const App = () => {
  const [chats, setChats] = useState([
    { id: 1, title: "New Chat", messages: [] },
  ]);
  const [activeChat, setActiveChat] = useState(1);

  const addChat = () => {
    const newChat = {
      id: chats.length + 1,
      title: `Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
  };

  const updateChat = (id, newMessages) => {
    setChats(
      chats.map((chat) =>
        chat.id === id ? { ...chat, messages: newMessages } : chat
      )
    );
  };

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        addChat={addChat}
      />
      <ChatWindow
        chat={chats.find((chat) => chat.id === activeChat)}
        updateChat={(newMessages) => updateChat(activeChat, newMessages)}
      />
    </div>
  );
};

export default App;

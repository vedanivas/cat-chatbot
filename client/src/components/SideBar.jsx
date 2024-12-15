const Sidebar = ({ chats, activeChat, setActiveChat, addChat }) => {
  return (
    <div className="sidebar">
      <button onClick={addChat} className="new-chat-btn">
        + New Chat
      </button>
      <ul className="chat-list">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`chat-item ${chat.id === activeChat ? "active" : ""}`}
            onClick={() => setActiveChat(chat.id)}
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

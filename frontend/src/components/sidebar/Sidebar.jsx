import NewChatButton from './NewChatButton';
import ChatList from './ChatList';

const Sidebar = ({ chats, activeChat, onChatSelect, onNewChat }) => {
  return (
    <div className="w-64 h-screen border-r dark:border-gray-700 flex flex-col p-2">
      <NewChatButton onClick={onNewChat} />
      <ChatList
        chats={chats}
        activeChat={activeChat}
        onChatSelect={onChatSelect}
      />
    </div>
  );
};

export default Sidebar;
import clsx from 'clsx';

const ChatList = ({ chats, activeChat, onChatSelect }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onChatSelect(chat.id)}
          className={clsx(
            'flex items-center space-x-2 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg',
            activeChat === chat.id && 'bg-gray-100 dark:bg-gray-800'
          )}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>Chat {chat.id + 1}</span>
        </button>
      ))}
    </div>
  );
};

export default ChatList;
import React from 'react';

const NewChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
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
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span>New Chat</span>
    </button>
  );
};

export default NewChatButton;
import React from 'react';

const ThinkingAnimation = () => {
  return (
    <div className="flex items-center space-x-2 p-4">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.6s]" />
    </div>
  );
};

export default ThinkingAnimation;
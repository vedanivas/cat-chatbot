import { useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import ThinkingAnimation from './ThinkingAnimation';

const ChatWindow = ({ messages, onSendMessage, isThinking }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            isUser={message.role === 'user'}
          />
        ))}
        {isThinking && <ThinkingAnimation />}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={onSendMessage} isThinking={isThinking} />
    </div>
  );
};

export default ChatWindow;
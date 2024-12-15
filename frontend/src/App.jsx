import { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import ChatWindow from './components/chat/ChatWindow';
import ThemeToggle from './components/ThemeToggle';
import useChat from './hooks/useChat';

function App() {
  const initialDarkMode = window.localStorage.getItem('darkMode') === 'true';
  const [darkMode, setDarkMode] = useState(initialDarkMode);

  const {
    chats,
    activeChat,
    isThinking,
    currentChat,
    handleNewChat,
    handleSendMessage,
    handleSelectChat,
  } = useChat();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('darkMode', true);
    } else {
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('darkMode', false);
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={handleSelectChat}
        onNewChat={handleNewChat}
      />
      <div className="flex-1">
        <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        <ChatWindow
          messages={currentChat.messages}
          onSendMessage={handleSendMessage}
          isThinking={isThinking}
        />
      </div>
    </div>
  );
}

export default App;
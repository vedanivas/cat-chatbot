import { useState, useEffect, useRef } from 'react';
import axios from 'axios'

export const useChat = () => {
  const [chats, setChats] = useState([{ id: 0, messages: [{role: 'user', content: 'Loading messages...'}] }]);
  const [activeChat, setActiveChat] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [streamData, setStreamData] = useState("");

  const wsRef = useRef(null);

  useEffect(() => {
    // Create a new WebSocket connection
    wsRef.current = new WebSocket("ws://localhost:8000/ws");

    wsRef.current.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    wsRef.current.onmessage = (event) => {
      // Handle incoming messages from the server
      if (event.data === "[START]") {
        console.log("Start receiving data from the server.");
        setStreamData("");
      }
      else {
        setIsThinking(false);

        setStreamData((prev) => {
          const updated = prev + event.data; 

          setChats((prevChats) => {
            const updatedChats = [...prevChats];

            const currMsgs = [...updatedChats[activeChat].messages];

            if (currMsgs.length > 0 && currMsgs[currMsgs.length - 1].role === 'bot') {
              currMsgs[currMsgs.length - 1] = {
                ...currMsgs[currMsgs.length - 1],
                content: updated,
              };
            } else {
              currMsgs.push({ role: 'bot', content: updated }); 
            }

            updatedChats[activeChat] = {
              ...updatedChats[activeChat],
              messages: currMsgs,
            };

            return updatedChats; 
          });

          console.log(updated);
          return updated; 
        });

      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error observed:", error);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    // Clean up on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const get_chats = async () => {
      const response = await axios.get("http://localhost:8000/get_chats");
      const data = response.data;
      console.log(data)
      setChats(data);
    }

    const get_messages = async () => {
      const response = await axios.get("http://localhost:8000/get_messages");
      const data = response.data;

      setChats((prevChats) => {
        const updatedChats = [...prevChats];

        updatedChats[activeChat] = {
          ...prevChats[activeChat],
          messages: data,
        };

        return updatedChats;
      })
    }

    get_chats();
    // get_messages();
    console.log(chats)
  }, [])

  const handleNewChat = async () => {
    const newChatId = chats.length;
    await axios.post(`http://localhost:8000/create_thread`, { id: newChatId });

    setChats([...chats, { id: newChatId, messages: [] }]);
    setActiveChat(newChatId);
  };

  const handleSendMessage = async (content) => {
    setIsThinking(true);

    setChats((prevChats) => {

      const updatedChats = [...prevChats];

      updatedChats[activeChat] = {
        ...prevChats[activeChat],
        messages: [...prevChats[activeChat].messages, { role: 'user', content }],
      };

      return updatedChats;
    });


    // Simulate API delay
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        await wsRef.current.send(content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSelectChat = async (chatId) => {
    await axios.post(`http://localhost:8000/select_thread`, { id: chatId })

    setActiveChat(chatId);
  };

  return {
    chats,
    activeChat,
    isThinking,
    currentChat: chats.find(chat => chat.id === activeChat),
    handleNewChat,
    handleSendMessage,
    setActiveChat,
    handleSelectChat,
    streamData
  };
};

export default useChat;
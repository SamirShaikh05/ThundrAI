import { createContext, useContext, useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [newchat, setNewChat] = useState([]);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const newChatLocked = useRef(false);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored || stored == "undefined") {
      return null;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.reload();
  }

  const loadChat = (index) => {
    if (newchat[index]) {
      setChatHistory([...newchat[index]]);
      setCurrentConversationId(newchat[index][0]?.conversationId || null);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chats/${user._id}`)
      .then(res => res.json())
      .then(data => {
        const groups = data.reduce((acc, chat) => {
          const cid = chat.conversationId;
          if (!acc[cid]) acc[cid] = [];
          acc[cid].push(chat);
          return acc;
        }, {});

        const convos = Object.values(groups).map(convo => 
          convo.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        );

        convos.sort((a, b) => new Date(a[0].createdAt) - new Date(b[0].createdAt)); 

        setNewChat(convos);

        if (convos.length > 0) {
          loadChat(convos.length - 1); 
        } else {
          setCurrentConversationId(uuidv4());
        }
      })
      .catch(err => console.error("DB fetch error:", err));
  }, [user]);

  return (
    <ChatContext.Provider value={{ chatHistory, setChatHistory, newchat, setNewChat, loadChat, firstMessageSent, setFirstMessageSent, newChatLocked, user, setUser, login, logout, currentConversationId, setCurrentConversationId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../config";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("user"));

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${userInfo?.token}`,
    },
  };

  useEffect(() => {
    const getAllUsers = async () => {
      const { data } = await axios.get(
        `${BASE_URL}/api/user/all-users`,
        config
      );

      setAllUsers(data);
    };

    getAllUsers();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        config,
        userInfo,
        allUsers,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

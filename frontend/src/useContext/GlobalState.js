import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const SOCKET_URL = "http://localhost:3000";
export const socket = io(SOCKET_URL);
export const Store = createContext();

export const useMyContext = () => useContext(Store);
export const GlobalState = createContext();
export const DataProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  //

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    setUser(user);
  }, []);
  const data = {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    chats,
    setChats,
    socket,
    SOCKET_URL,
    selectedChat,
  };
  return <Store.Provider value={data}>{children}</Store.Provider>;
};

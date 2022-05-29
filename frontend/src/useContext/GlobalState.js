import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
// const SOCKET_URL = "https://messagesfree.herokuapp.com";
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
  const [BoldFont, setBoldFont] = useState(false);
  const [images, setImages] = useState();

  //

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));
    if (data) {
      setUser(data);
    }
  }, [selectedChat]);
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
    BoldFont,
    setBoldFont,
    images,
    setImages,
  };
  return <Store.Provider value={data}>{children}</Store.Provider>;
};

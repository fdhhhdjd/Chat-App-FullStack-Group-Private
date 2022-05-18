import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const SOCKET_URL = "http://localhost:3000";
export const socket = io(SOCKET_URL);
export const Store = createContext();

export const useMyContext = () => useContext(Store);
export const GlobalState = createContext();
export const DataProvider = ({ children }) => {
  const [user, setUser] = useState();
  //
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessage, setNewMessage] = useState({});

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setUser(user);
  }, []);
  const data = {
    user,
    setUser,
    rooms,
    setRooms,
    currentRoom,
    setCurrentRoom,
    members,
    setMembers,
    messages,
    setMessages,
    privateMemberMsg,
    setPrivateMemberMsg,
    newMessage,
    setNewMessage,
    socket,
    SOCKET_URL,
  };
  return <Store.Provider value={data}>{children}</Store.Provider>;
};

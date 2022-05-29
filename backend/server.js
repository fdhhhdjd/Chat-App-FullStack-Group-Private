const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: ".env" });
const express = require("express");
const connectDB = require("./configs/db");
const socket = require("socket.io");
const { json } = require("body-parser");
const Message = require("./Model/messageModel");
const Users = require("./Model/userModel");
const Chats = require("./Model/chatModel");
const cors = require("cors");
const bodyParser = require("body-parser");
const os = require("os");
connectDB();
// process.env.UV_THREADPOOL_SIZE = os.cpus().length;
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: ".env" });
}
app.get("/rooms", (req, res) => {
  res.json(rooms);
});
app.get("/tai", (req, res) => {
  return res.status(200).json({
    status: "200",
    message: "WellCome To Tai Heo.",
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(
    `server is listening on port:http://localhost:${PORT}`.yellow.bold
  )
);
const io = socket(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONT_END,
    credentials: true,
  },
});
global._io = io;
async function getLastMessageFromRoom(room) {
  let roomMessage = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessage;
}
//Sắp xếp lại ngày
// 02/11/2022
// 20220211
function SortRoomMessageByDate(message) {
  return message.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];
    return date1 < date2 ? -1 : 1;
  });
}

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room, user) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // socket.on("new message", (newMessageRecieved) => {
  //   var chat = newMessageRecieved.chat;
  //   if (!chat.users) return console.log("chat.users not defined");
  //   chat.users.forEach((user) => {
  //     if (user._id == newMessageRecieved.sender._id) return;
  //     return socket.in(user._id).emit("message recieved", newMessageRecieved);
  //   });
  // });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

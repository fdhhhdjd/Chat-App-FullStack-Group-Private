const Chats = require("../Model/chatModel");
const Users = require("../Model/userModel");
const chatCtrl = {
  CreateGroupChat: async (req, res, next) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
    users.push(req.user);

    try {
      const groupChat = await Chats.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      const fullGroupChat = await Chats.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400).json({
        msg: error.message,
      });
    }
  },
  RenameFromGroup: async (req, res, next) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chats.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.json({
        status: 400,
        success: false,
        msg: "Chat Not Found",
      });
    } else {
      res.status(200).json({ status: 200, success: true, updatedChat });
    }
  },
  AddToGroup: async (req, res, next) => {
    //push them phan tu vao mang
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const added = await Chats.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.json({
        status: 400,
        success: false,
        msg: "Chat Not Found",
      });
    } else {
      res.status(200).json({
        status: 200,
        success: true,
        added,
      });
    }
  },
  RemoveFromGroup: async (req, res, next) => {
    //pull xoa phan tu khoi mang
    const { chatId, userId } = req.body;

    const removed = await Chats.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.json({
        status: 400,
        success: false,
        msg: "Chat Not Found",
      });
    } else {
      res.status(200).json({
        status: 200,
        success: true,
        removed,
      });
    }
  },
  fetchChats: async (req, res, next) => {
    try {
      //elemMatch:tìm kiếm phần tử trong mảng
      Chats.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await Users.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).json({
            status: 200,
            msg: "success",
            results,
          });
        });
    } catch (error) {
      res.status(400).json({
        msg: error.message,
      });
    }
  },
  accessChat: async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }

    var isChat = await Chats.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await Users.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createdChat = await Chats.create(chatData);
        const FullChat = await Chats.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        console.log;
        res.status(400).json({
          msg: error.message,
        });
      }
    }
  },
};
module.exports = chatCtrl;

const Messages = require("../Model/messageModel");
const Users = require("../Model/userModel");
const Chats = require("../Model/chatModel");
const MessageCtrl = {
  AllMessages: async (req, res, next) => {
    try {
      const messages = await Messages.find({ chat: req.params.chatId })
        .populate("sender", "name pic email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400).json({
        msg: error.message,
      });
    }
  },

  SendMessage: async (req, res, next) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.json({ status: 400, msg: "Invalid data passed into request" });
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
    try {
      var message = await Messages.create(newMessage);
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await Users.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });
      await Chats.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });
      res.json(message);
    } catch (error) {
      res.status(400).json({
        msg: error.message,
      });
    }
  },
};

module.exports = MessageCtrl;

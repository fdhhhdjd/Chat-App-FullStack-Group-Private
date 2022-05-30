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
    const { content, chatId, time, date } = req.body;
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.json({ status: 400, msg: "Invalid data passed into request" });
    }
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
      time,
      date,
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
      _io.emit("new message", message);
      res.json(message);
    } catch (error) {
      res.status(400).json({
        msg: error.message,
      });
    }
  },
  UpDateIcon: async (req, res, next) => {
    const { icon } = req.body;
    try {
      const data = "icon";
      await Messages.findOneAndUpdate(
        { _id: req.params.id },
        {
          icons: {
            icon: icon,
            userId: req.user._id,
          },
        }
      );
      _io.emit("fetch", data);
      res.json({
        msg: "Icon Success",
      });
    } catch (error) {
      res.status(400).json({
        msg: error.message,
      });
    }
  },
};

module.exports = MessageCtrl;

// var message = await Messages.findById(req.params.id);
// var user = await Users.findById(req.user._id);

// if (message && user) {
//   switch (icon) {
//     case "1":
//       message.icons.haha.push(req.user._id);
//       user.icons.haha.push(req.params.id);

//       break;
//     case "2":
//       message.icons.love.push(req.user._id);
//       user.icons.love.push(req.params.id);

//       break;
//     case "3":
//       message.icons.hurry.push(req.user._id);
//       user.icons.hurry.push(req.params.id);

//       break;
//     case "4":
//       message.icons.like.push(req.user._id);
//       user.icons.like.push(req.params.id);

//       break;
//   }
// }
// await message.save();
// await user.save();
// res.json({
//   status: 200,
//   msg: "success",
//   user,
//   message,
// });
// } catch (error) {
// res.status(400).json({
//   msg: error.message,
// });
// }

const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    time: {
      type: String,
    },
    date: {
      type: String,
    },
    icons: {
      userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      icon: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6],
      },
    },

    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
//  icons: {
//     love: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     haha: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     hurry: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   },

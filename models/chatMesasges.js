const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    recipientId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;

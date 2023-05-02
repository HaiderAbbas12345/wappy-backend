const mongoose = require("mongoose");

const botsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["enable", "disable"],
      default: "enable",
    },
    sendTo: {
      type: String,
      required: true,
      enum: ["all", "individual", "group"],
      default: "all",
    },
    type: {
      type: String,
      required: true,
      enum: ["only", "whole"],
      default: "only",
    },
    name: {
      type: String,
      required: true,
    },
    keywords: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    caption: {
      type: String,
    },
  },
  { timestamps: true }
);

const bots = mongoose.model("bots", botsSchema);
module.exports = bots;

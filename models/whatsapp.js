const mongoose = require("mongoose");

const whatsappSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientNumber: { type: String },
    customerNumber: { type: String },
    chat: [
      {
        message: {
          type: String,
        },
        media: [
          {
            type: String,
            url: String,
          },
        ],
        timestamp: {
          type: Date,
          default: Date.now,
        },
        fromMe: {
          type: Boolean,
          default: false,
        },
        author: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const whatsapp = mongoose.model("whatsapp", whatsappSchema);
module.exports = whatsapp;

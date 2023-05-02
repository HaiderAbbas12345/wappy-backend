const { Client, RemoteAuth } = require("whatsapp-web.js");
const WhatsappModal = require("../models/whatsapp");
const botsModel = require("../models/bots");
const ClientModel = require("../models/client");
const CircularJSON = require("circular-json");
const Fuse = require("fuse.js");

const uuid = require("uuid");
const fs = require("fs");

// Require database
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
const ChatMessage = require("../models/chatMesasges");

const connectWhatsApp = (io) => {
  const clients = {};
  io.on("connection", (socket) => {
    console.log(socket.id);
    const clientId = uuid.v4();
    socket.on("createClient", async (data) => {
      const store = new MongoStore({ mongoose: mongoose });

      const client = new Client({
        session: null,
        qrTimeoutMs: 90000,
        authTimeoutMs: 90000,
        restartOnAuthFail: true,
        puppeteer: {
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          timeout: 90000,
        },
        authStrategy: new RemoteAuth({
          clientId: clientId,
          store: store,
          backupSyncIntervalMs: 300000,
        }),
      });

      client.on("authenticated", async (session) => {
        console.log(`Client ${clientId} is authenticated`);
        // const clientJson = client.toJSON();
        // const clientJson = CircularJSON.stringify(client);
        const clientJson = {};
        // console.log(clientJson);

        // const clientModel = new ClientModel({
        //   userId: data,
        //   clientId: clientId,
        //   session: clientJson,
        // });
        // await clientModel.save();
      });

      client.on("qr", (qr) => {
        io.to(socket.id).emit("qr", qr);
      });

      client.on("ready", () => {
        console.log(`Client ${clientId} is ready`);
        clients[clientId] = client;
        io.to(socket.id).emit("authenticatedClient", {
          client: client.info,
          clientId,
        });
      });

      client.on("auth_failure", (session) => {
        console.log(`Client ${clientId} authentication failure`);
      });

      await client.initialize();
    });

    socket.on("sendMessage", async (data) => {
      if (!data) {
        console.error("No data provided for sendMessage");
        return;
      }

      const { clientId, senderId, recipientId, message } = data;

      const chatId = "923009475655";

      try {
        const chat = await clients[clientId].sendMessage(
          `${chatId}@c.us`,
          message
        );

        const chatMessage = new ChatMessage({
          senderId: chatId,
          recipientId: chatId,
          message,
        });

        await chatMessage.save();

        if (chat.fromMe) {
          const botMessage = await chatBotMessages(message.id, message);

          const chatMessage = new ChatMessage({
            senderId: chatId,
            recipientId: chatId,
            message,
          });

          await chatMessage.save();

          if (botMessage) {
            await chat.reply(botMessage.item.caption);
          } else {
            await chat.reply("Could not find response to your message");
          }
        }

        io.emit("newChatMessage", chatMessage);

        console.log(
          `Client ${clientId} created a new chat with ID ${chat.id._serialized}`
        );
      } catch (err) {
        console.error(`Client ${clientId} failed to create a new chat: ${err}`);
      }
    });
  });
};

const chatBotMessages = async (id, message) => {
  try {
    const bots = await botsModel.find({ userId: id });
    const options = {
      keys: ["keywords"],
      threshold: 0.3,
    };

    const fuse = new Fuse(bots, options);

    const result = fuse.search(message);
    if (bots.length !== 0) {
      return result[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

const handleAddContact = async (req, res) => {
  const { userId, clientNumber, customerNumber } = req.body;
  console.log(userId, clientNumber, customerNumber);
  try {
    let chat = await WhatsappModal.findOne({
      userId,
      customerNumber,
      clientNumber,
    });
    if (!chat) {
      chat = await WhatsappModal.create({
        userId,
        customerNumber,
        clientNumber,
      });
      return res.status(200).json({ data: chat, message: "Server error" });
    } else {
      return res
        .status(400)
        .json({ data: chat, message: "Contact Already Exist" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const handleWhatsAppChat = async (req, res) => {
  const {
    userId,
    clientNumber,
    customerNumber,
    message,
    media,
    fromMe,
    author,
    type,
  } = req.body;

  try {
    let chat = await WhatsappModal.findOne({
      userId,
      clientNumber,
      customerNumber,
    });
    if (!chat) {
      chat = await WhatsappModal.create({
        userId,
        clientNumber,
        customerNumber,
        chat: [{ message, media, fromMe, author, type }],
      });
    } else {
      chat.chat.push({ message, media, fromMe, author, type });
      await chat.save();
      return res.status(201).json({ chat, success: true });
    }
    return res.status(200).json({ chat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getUsersChats = async (req, res) => {
  const {
    userId,
    clientNumber,
    customerNumber,
    chatId,
    limit = 10,
    page = 1,
  } = req.body;
  const skip = (page - 1) * limit;
  try {
    const chat = await WhatsappModal.findOne(
      { userId, clientNumber, customerNumber, chatId },
      { chat: { $slice: [skip, limit] } }
    );
    return res.status(200).json({ chat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getAllChatsBynumber = async (req, res) => {
  const { userId, customerNumber } = req.body;
  try {
    const chat = await WhatsappModal.find({ userId, customerNumber });
    if (chat.length === 0) {
      return res.status(404).json({ data: chat, success: true });
    } else {
      return res.status(200).json({ data: chat, success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  connectWhatsApp,
  handleWhatsAppChat,
  getUsersChats,
  getAllChatsBynumber,
  handleAddContact,
};

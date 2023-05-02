const botsModel = require("../models/bots");
const Fuse = require("fuse.js");

const getAllbots = async (req, res) => {
  botsModel
    .find()
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const addNewBot = async (req, res) => {
  const chatbot = new botsModel({
    userId: req.body.userId,
    phoneNumber: req.body.phoneNumber,
    status: req.body.status,
    sendTo: req.body.sendTo,
    message: req.body.message,
    name: req.body.name,
    type: req.body.type,
    keywords: req.body.keywords,
    caption: req.body.caption,
    imageUrl: req.body.imageUrl,
    fileUrl: req.body.fileUrl,
  });
  try {
    const newChatbot = await chatbot.save();
    res.status(201).json(newChatbot);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const getBotsById = async (req, res) => {
  console.log(req);
  try {
    const bots = await botsModel.find({ userId: req.body.userId });
    if (bots.length === 0) {
      res.status(404).send({
        success: true,
        message: "No bots found",
      });
    } else {
      res.status(200).send({
        data: bots,
        success: true,
        message: "bots found successfully",
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, err });
  }
};

const getBotsbyPhone = async (req, res) => {
  try {
    const botData = await botsModel.find({ phoneNumber: req.body.phoneNumber });
    if (botData.length === 0) {
      res.status.send({
        success: true,
        message: "No data found",
      });
    } else {
      const options = {
        keys: ["keywords"],
        threshold: 0.3,
      };

      const fuse = new Fuse(botData, options);

      const result = fuse.search("help");

      res.status(200).send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error" || error,
    });
  }
};

module.exports = {
  getAllbots,
  addNewBot,
  getBotsById,
  getBotsbyPhone,
};

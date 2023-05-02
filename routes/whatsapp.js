const router = require("express").Router();

const {
  handleWhatsAppChat,
  getUsersChats,
  getAllChatsBynumber,
  handleAddContact,
} = require("../controllers/whatsapp");

router.post("/handleWhatsAppChat", handleWhatsAppChat);
router.post("/getUsersChats", getUsersChats);
router.post("/getAllChatsBynumber", getAllChatsBynumber);
router.post("/handleAddContact", handleAddContact);

module.exports = router;

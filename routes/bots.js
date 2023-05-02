const router = require("express").Router();

const {
  getAllbots,
  addNewBot,
  getBotsById,
  getBotsbyPhone,
} = require("../controllers/bots");

router.get("/getAllBots", getAllbots);
router.post("/addNewBot", addNewBot);
router.post("/getBotsById", getBotsById);
router.post("/getBotsbyPhone", getBotsbyPhone);

module.exports = router;

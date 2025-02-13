const express = require("express");
const {
  isWorking,
  getConversationMessages,
  sendMessage,
  deleteMessage,
} = require("../controllers/messageController");
const { botAsk } = require("../controllers/botController");
const router = express.Router();

router.get("/", isWorking);
router.get("/:idRoom", getConversationMessages);
router.post("/:idRoom", sendMessage);
router.delete("/:idRoom", deleteMessage);
router.post("/:idRoom/:idMessage/toggleLike" /* togglemessage */);
router.post("/bot/send/:idRoom", botAsk, sendMessage);

module.exports = router;

const express = require("express");
const {
  isWorking,
  getConversationMessages,
  sendMessage,
  deleteMessage,
} = require("../controllers/messageController");
const router = express.Router();

router.get("/", isWorking);
router.get("/:IdRoom", getConversationMessages);
router.post("/:IdRoom", sendMessage);
router.delete("/:IdRoom", deleteMessage);
router.post("/:IdRoom/:IdMessage/toggleLike" /* togglemessage */);

module.exports = router;

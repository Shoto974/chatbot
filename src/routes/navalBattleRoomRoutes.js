const express = require("express");
const { authMiddlewares } = require("../middlewares/authMiddlewares");
const {
  createNavalBattleRoom,
  getNavalBattleRooms,
} = require("../controllers/navalBattleRoomController");
const router = express.Router();

router.post("/create", authMiddlewares, createNavalBattleRoom);
router.get("/getRooms", getNavalBattleRooms);

module.exports = router;

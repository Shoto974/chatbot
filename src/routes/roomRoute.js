const express = require("express");
const { authMiddlewares } = require("../middlewares/authMiddlewares");
const {
  createRoom,
  deleteRoom,
  joinRoom,
  getRooms,
} = require("../controllers/roomController");
const router = express.Router();

router.post("/createRoot", authMiddlewares, createRoom);
router.delete("/deleteRoom", authMiddlewares, deleteRoom);
router.put("/joinRoom", authMiddlewares, joinRoom);
router.get("/getRooms", authMiddlewares, getRooms);

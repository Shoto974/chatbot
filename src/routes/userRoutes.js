const express = require("express");
const {
  registerUser,
  loginUser,
  getUserInfos,
} = require("../controllers/userController");
const { authMiddlewares } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", authMiddlewares, getUserInfos);

module.exports = router;

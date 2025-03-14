const express = require("express");
const {
  registerUser,
  loginUser,
  getUserInfos,
  updateInWallet,
} = require("../controllers/userController");
const { authMiddlewares } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", authMiddlewares, getUserInfos);
router.post("/wallet/update", authMiddlewares, updateInWallet);

module.exports = router;

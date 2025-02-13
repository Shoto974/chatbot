const express = require("express");
const {
  registerUser,
  loginUser,
  getUserInfos,
} = require("../controllers/userController");
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", getUserInfos);

module.exports = router;

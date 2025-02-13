const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const router = express.Router();

router.get("/login", loginUser);
router.get("/register", registerUser);

module.exports = router;

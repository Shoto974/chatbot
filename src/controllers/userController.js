const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = "jsuislecodesupersecretquonpeutpastrouver";

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: "User already exists" });
    console.log(username, password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not register" });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        //On créé le JWT
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: "5h" });
        res.status(200).json({ token: token });
      } else {
        res.status(401).json({ message: "Unauthorized : invalid" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized : compte introuvable" });
    }
  } catch (error) {}
};

exports.getUserInfos = async (req, res) => {
  const id = req.user.userId;

  try {
    if (!id) return res.status(401).json({ message: "Unauthorized" });
    console.log(id);
    const user = await User.findOne({ _id: id }).select("-password");

    if (!user) return res.status(400).json({ message: "User does not exists" });

    return res.status(200).json({ id: user._id, username: user.username });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Error" });
  }
};

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = "jsuislecodesupersecretquonpeutpastrouver";

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ message: "Could not register" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        //On créé le JWT
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: "5h" });
        res.json({ token });
      } else {
        res.status(401).json({ message: "Unauthorized : invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized : invalid credentials" });
    }
  } catch (error) {}
};

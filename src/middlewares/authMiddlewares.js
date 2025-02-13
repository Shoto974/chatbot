const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/env");

exports.authMiddlewares = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) res.status(400).json({ message: "Le token n'est pas renségné" });
  token = token.split(" ")[1];

  const decoded = jwt.verify(token, SECRET);

  if (!decoded)
    res.status(400).json({ message: "le token ne correspond pas " });
  req.user = { userId: decoded.userId, jwt: token };
  next();
};

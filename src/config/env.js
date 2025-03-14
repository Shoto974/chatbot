require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  SECRET: process.env.SECRET,
};

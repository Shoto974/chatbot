const mongoose = require("mongoose");
const { DB_URI } = require("./env");

const connectionDB = async () => {
  try {
    await mongoose.connect(`${DB_URI}`);
    console.log("DB Mongo connected");
  } catch (error) {
    console.error("DB Mongo failed to connect", error);
    process.exit(1);
  }
};

module.exports = connectionDB;

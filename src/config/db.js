const mongoose = require("mongoose");

const connectionDB = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URI}`);
    console.log("DB Mongo connected");
  } catch (error) {
    console.error("DB Mongo failed to connect", error);
    process.exit(1);
  }
};

module.exports = connectionDB;

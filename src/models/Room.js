const { Schema, default: mongoose } = require("mongoose");

const roomSchema = Schema({
  name: { type: String, require: true },
  password: { type: String },
  status: { type: Boolean, require: true },
  members: [
    {
      userId: { type: String },
    },
  ],
  //Stocker le user ID
  owner: { type: String, require: true },
});

module.exports = mongoose.model("Room", roomSchema);

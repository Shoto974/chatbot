const { Schema, default: mongoose } = require("mongoose");

const messageSchema = Schema({
  sender: {
    id: { type: String, require: true },
    username: { type: String, require: true },
  },
  content: { type: String, require: true },
  idRoom: { type: Number, require: true },
  likedby: [
    {
      id: { type: String },
      username: { type: String },
    },
  ],
});

module.exports = mongoose.model("Message", messageSchema);

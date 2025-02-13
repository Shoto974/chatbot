const Message = require("../models/Message");

exports.isWorking = async (req, res) => {
  try {
    return res.status(200).json({ msg: "Connecté au serveur." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err);
  }
};

exports.getConversationMessages = async (req, res) => {
  try {
    const idRoom = req.params.idRoom;
    if (!idRoom) {
      return res.status(400).json({ msg: "Id room is required" });
    }
    Message.find()
      .then((messages) => res.status(200).json(messages))
      .catch((error) => res.status(400).json(error));
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err);
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { sender, content } = req.body;
    const idRoom = req.params.idRoom;

    if (!sender || !content || !idRoom) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const message = new Message({ ...req.body, idRoom: idRoom });
    message.save();
    res.send("Message sent successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ msg: "Id message is required" });
    }
    res.delete();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

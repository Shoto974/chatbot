const bcrypt = require("bcryptjs");
const Room = require("../models/Room");

exports.createRoom = async (req, res) => {
  const { name, password, status } = req.body;
  const { userId } = req.user;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    let room = new Room({
      name,
      hashedPassword,
      status,
      members: [userId],
      owner: userId,
    });
    await room.save();
    res.status(201).json({ message: "Room created" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Could not create room" });
  }
};

exports.deleteRoom = async (req, res) => {
  const { userId } = req.user;
  const { idRoom, owner } = req.body;

  try {
    let room = await Room.findOne({ _id: idRoom });

    //Test si la room existe
    if (!room) return res.status(404).json({ message: "Room not found" });

    //Test si la personne est autorisée à supprimer la room
    if (userId != owner)
      return res
        .status(403)
        .json({ message: "You're not allowed to delete this room" });

    Room.deleteOne({ _id: idRoom });
    return res.status(204).json({ message: "Room deleted" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Could not delete room" });
  }
};

exports.getRooms = async (req, res) => {
  const { userId } = req.user;
  try {
    let rooms = Room.find({
      $or: [{ status: true }, { members: { $in: [userId] } }],
    });

    if (!rooms) return res.status(400).json({ message: "Rooms empty" });

    res.status(200).json({ rooms });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Could not delete room" });
  }
};

exports.joinRoom = async (req, res) => {
  const { idRoom } = req.body;
  const { userId } = req.user;

  try {
    let room = await Room.UpdateOne(
      { _id: idRoom },
      { $push: { members: userId } }
    );

    return res.status(202).json({ room });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Could not delete room" });
  }
};

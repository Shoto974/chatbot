const bcrypt = require("bcryptjs");
const NavalBattleRoom = require("../models/NavalBattleRoom");

exports.createNavalBattleRoom = async (req, res) => {
  const { name, password, gamble } = req.body;
  const { userId } = req.user;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    res.status(201).json({ message: "Room created" });

    let navalBattleRoom = new NavalBattleRoom({
      name,
      hashedPassword,
      gamble,
      started: false,

      owner: userId,
    });

    await navalBattleRoom.save();
    res.status(201).json({ message: "Room created" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Could not create room" });
  }
};

exports.deleteNavalBattleRoom = async (req, res) => {
  const { userId } = req.user;
  const { idRoom, owner } = req.body;

  try {
    let navalBattleRoom = await NavalBattleRoom.findOne({ _id: idRoom });

    //Test si la room existe
    if (!navalBattleRoom)
      return res.status(404).json({ message: "Room not found" });

    //Test si la personne est autorisée à supprimer la room
    if (userId != owner)
      return res
        .status(403)
        .json({ message: "You're not allowed to delete this room" });

    NavalBattleRoom.deleteOne({ _id: idRoom });
    return res.status(204).json({ message: "Room deleted" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Could not delete room" });
  }
};

exports.getNavalBattleRooms = async (_, res) => {
  try {
    NavalBattleRoom.find({
      started: false,
    })
      .then((messages) => res.status(200).json(messages))
      .catch((error) => res.status(400).json(error));
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Could not get rooms" });
  }
};

exports.getNavalBattleRoom = async (req, res) => {
  const { idRoom } = req.params;

  try {
    let navalBattleRoom = NavalBattleRoom.findOne({ _id: idRoom });

    if (!navalBattleRoom)
      return res.status(404).json({ message: "Room not found" });

    res.status(200).json({ navalBattleRoom });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Could not get room" });
  }
};

exports.joinNavalBattleRoom = async (req, res) => {
  const { idRoom } = req.body;
  const { userId } = req.user;

  try {
    let navalBattleRoom = await NavalBattleRoom.UpdateOne(
      { _id: idRoom },
      { playerTwoId: userId }
    );
    res.status(200).json({ navalBattleRoom });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Could not join room" });
  }
};

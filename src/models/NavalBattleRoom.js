const { Schema, default: mongoose } = require("mongoose");

const navalBattleRoomSchema = Schema({
  name: { type: String, require: true },
  password: { type: String },
  gamble: { type: Number },
  started: { type: Boolean, default: false },

  // Players ID
  owner: { type: String, require: true },
  playerId2: { type: String },

  // Nava Battle Grid
  // Player 1 Grid
  shipGrid1: { type: Array, require: true },
  shootGrid1: { type: Array, require: true },

  // Player 2 Grid
  shipGrid2: { type: Array, require: true },
  shootGrid2: { type: Array, require: true },

  // Game settings
  started: { type: Boolean, default: false },
  turn: { type: Number, default: 1 },
  winner: { type: String },

  ships: { type: Array, default: [5, 4, 3, 3, 2] },
  gridLenght: { type: Number, default: 10 },
  gridHeight: { type: Number, default: 10 },
});

module.exports = mongoose.model("NavalBattleRoom", navalBattleRoomSchema);

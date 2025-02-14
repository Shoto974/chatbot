const express = require("express");
const userRoutes = require("./src/routes/userRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const { PORT } = require("./src/config/env");
const connectionDB = require("./src/config/db");
const expressWs = require("express-ws");
const { addClient } = require("./src/config/wsManager");
const app = express();
const cors = require("cors");

app.use(cors());
//Init serveur ws
expressWs(app);
app.ws("/ws", (ws, req) => {
  addClient(ws);
});
app.use(express.json());

connectionDB();
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

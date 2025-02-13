const express = require("express");
const userRoutes = require("./src/routes/userRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const { PORT } = require("./src/config/env");
const connectionDB = require("./src/config/db");
const app = express();

app.use(express.json());

connectionDB();
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

const express = require("express");
const userRoutes = require("./src/routes/userRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const { PORT } = require("./src/config/env");
const app = express();

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

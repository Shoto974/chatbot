const express = require("express");
const userRoutes = require("./src/routes/userRoutes");
const messageRoutes = require("./src/routes/messageRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

module.exports = app;

const express = require("express");
const userRoutes = require("./src/routes/userRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const roomRoutes = require("./src/routes/roomRoute");
const navalBattleRoomRoutes = require("./src/routes/navalBattleRoomRoutes");
const { PORT } = require("./src/config/env");
const connectionDB = require("./src/config/db");
const expressWs = require("express-ws");
const { addClient } = require("./src/config/wsManager");
const app = express();
const cors = require("cors");
const fs = require("fs");
const https = require("https");

app.use(cors());

const server = https.createServer(
  {
    key: fs.readFileSync("./ssl/server-key.pem"),
    cert: fs.readFileSync("./ssl/server-cert.pem"),
  },
  app
);
//Init serveur ws
expressWs(app, server);
app.ws("/ws", (ws, req) => {
  addClient(ws);
});

// Structure pour suivre les utilisateurs dans chaque salle
const rooms = new Map(); // roomId -> Map(userId -> WebSocket)
const clients = new Map(); // WebSocket -> { roomId, userId }

//Websocket Web RTC
app.ws("/ws/rtc/:roomId", (ws, req) => {
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case "join-room":
          // Stocker les informations de l'utilisateur
          clients.set(ws, { roomId: data.roomId, userId: data.id });

          // Créer la salle si elle n'existe pas
          if (!rooms.has(data.roomId)) {
            rooms.set(data.roomId, new Map());
          }

          // Ajouter l'utilisateur à la salle
          rooms.get(data.roomId).set(data.id, ws);
          console.log(`User ${data.id} joined room ${data.roomId}`);
          console.log(
            `Room ${data.roomId} now has ${rooms.get(data.roomId).size} users`
          );

          // Informer les autres utilisateurs déjà dans la salle
          rooms.get(data.roomId).forEach((clientWs, clientId) => {
            if (clientId !== data.id) {
              console.log(`Notifying ${clientId} about new user ${data.id}`);
              clientWs.send(
                JSON.stringify({
                  type: "new-user",
                  id: data.id,
                })
              );
            }
          });
          break;

        case "offer":
          // Check if we have target field (from updated client)
          const offerTargetId = data.target || data.id;
          const offerSourceId = data.id;

          console.log(
            `Relaying offer from ${offerSourceId} to ${offerTargetId} in room ${data.roomId}`
          );

          if (rooms.has(data.roomId)) {
            const targetWs = rooms.get(data.roomId).get(offerTargetId);

            if (targetWs && targetWs !== ws) {
              // Send the message with source ID correctly identified
              targetWs.send(
                JSON.stringify({
                  ...data,
                  id: offerSourceId, // Make sure ID represents the sender of the offer
                })
              );
            } else {
              console.log(`Target user ${offerTargetId} not found or is self`);
            }
          }
          break;

        case "answer":
          // Check if we have target field (from updated client)
          const answerTargetId = data.target || data.id;
          const answerSourceId = data.id;

          console.log(
            `Relaying answer from ${answerSourceId} to ${answerTargetId} in room ${data.roomId}`
          );

          if (rooms.has(data.roomId)) {
            const targetWs = rooms.get(data.roomId).get(answerTargetId);

            if (targetWs && targetWs !== ws) {
              // Send the message with source ID correctly identified
              targetWs.send(
                JSON.stringify({
                  ...data,
                  id: answerSourceId, // Make sure ID represents the sender of the answer
                })
              );
            } else {
              console.log(`Target user ${answerTargetId} not found or is self`);
            }
          }
          break;

        case "candidate":
          // Check if we have target field (from updated client)
          const candidateTargetId = data.target || data.id;
          const candidateSourceId = data.id;

          console.log(
            `Relaying ICE candidate from ${candidateSourceId} to ${candidateTargetId} in room ${data.roomId}`
          );

          if (rooms.has(data.roomId)) {
            const targetWs = rooms.get(data.roomId).get(candidateTargetId);

            if (targetWs && targetWs !== ws) {
              // Send the message with source ID correctly identified
              targetWs.send(
                JSON.stringify({
                  ...data,
                  id: candidateSourceId, // Make sure ID represents the sender of the candidate
                })
              );
            } else {
              console.log(
                `Target user ${candidateTargetId} not found or is self`
              );
            }
          }
          break;

        default:
          console.log(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    // Récupérer les informations de l'utilisateur
    const userInfo = clients.get(ws);

    if (userInfo) {
      const { roomId, userId } = userInfo;
      console.log(`User ${userId} disconnected from room ${roomId}`);

      // Supprimer l'utilisateur de la salle
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.delete(userId);

        // Notifier les autres utilisateurs
        room.forEach((clientWs, clientId) => {
          clientWs.send(
            JSON.stringify({
              type: "user-left",
              id: userId,
              roomId,
            })
          );
        });

        // Supprimer la salle si elle est vide
        if (room.size === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} removed (empty)`);
        }
      }

      // Supprimer l'entrée client
      clients.delete(ws);
    }
  });
});

app.use(express.json());
connectionDB();
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/navalBattle", navalBattleRoomRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

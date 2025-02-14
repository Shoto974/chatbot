const clients = new Set();

const addClient = (ws) => {
  clients.add(ws);
  ws.on("close", () => {
    clients.delete(ws);
  });
};

const sendToClients = (response) => {
  clients.forEach((client) => {
    if (client.readyState == 1) client.send(JSON.stringify(response));
  });
};

module.exports = { addClient, sendToClients };

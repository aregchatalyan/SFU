const path = require("path");
const http = require("http");
const express = require("express");
const https = require("httpolyglot");
const {Server} = require("socket.io");
const {config: load_env} = require("dotenv");

load_env();

let protocol;
let httpServer;
const app = express();

const socket = require("./socket");
const config = require("./config/config");

if (process.env.NODE_ENV === 'production') {
  protocol = 'http';
  httpServer = http.createServer({}, app);

  app.use(express.static(path.join(__dirname, "view", "build")));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "view", "build", "index.html"));
  });
} else {
  protocol = 'https';
  httpServer = https.createServer({
    key: config.sslKey,
    cert: config.sslCrt
  }, app);
}

httpServer.listen(config.listenPort, () => {
  console.log(`Listening on ${protocol}://${config.listenIp}:${config.listenPort}`);
});

socket(new Server(httpServer, {cors: {origin: "*"}}));

process.on("uncaughtException", (err) => {
  console.error(`Caught exception: ${err}`);
});

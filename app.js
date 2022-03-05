const path = require("path");
const http = require("http");
const express = require("express");
const https = require("httpolyglot");
const {Server} = require("socket.io");
const {exec} = require("child_process");
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

  app.get('/pull', (req, res) => {
    exec('git pull', (error, stdout, stderr) => {
      if (error) return console.error('Git pull failed.');
      console.log(stdout, 'Already up to date.')
      if (stdout !== 'Already up to date.') {
        setTimeout(() => {exec('pm2 reload 0')}, 3000);
        setTimeout(() => {exec('pm2 restart 0')}, 4000);
        res.send('Pulling..., Server is rebooting.');
      } else {
        res.send('Already up to date.');
      }
    });
  });

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

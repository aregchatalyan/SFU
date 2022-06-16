const path = require('path');
const http = require('http');
const cors = require('cors');
const express = require('express');
const https = require('httpolyglot');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const { config: load_env } = require('dotenv');

load_env();

const app = express();

const socket = require('./socket');
const config = require('./config');

let protocol;
let httpServer;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({ origin: '*' }));

app.use('/pull', require('./api/git-hook/git.route'));
app.use('/signin', require('./api/sign-in/signin.route'));

if (process.env.NODE_ENV === 'production') {
  protocol = 'http';
  httpServer = http.createServer(app);

  app.use(express.static(path.join(__dirname, 'view', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'build', 'index.html'));
  });
} else {
  protocol = 'https';
  httpServer = https.createServer({
    key: config.sslKey,
    cert: config.sslCrt
  }, app);
}

(async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Mongo connected');

    httpServer.listen(config.listenPort, () => {
      process.env.NODE_ENV === 'production' ?
        console.log(`Open ${protocol}://${config.listenIp}:${config.listenPort}`) :
        console.log(`Listening on ${protocol}://${config.listenIp}:${config.listenPort}`);
    });
  } catch (e) {
    console.error(e.message ? e.message : e);
  }
})();

socket(new Server(httpServer, { cors: { origin: '*' } }));

// process.on('uncaughtException', (err) => {
//   console.error(`Caught exception: ${err}`);
// });

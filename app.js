const path = require('path');
const http = require('http');
const cors = require('cors');
const express = require('express');
const https = require('httpolyglot');
const { Server } = require('socket.io');
const { exec } = require('child_process');
const { config: load_env } = require('dotenv');

load_env();

const app = express();
const mongo = require('./mongo');
const socket = require('./socket');
const config = require('./config');

let protocol;
let httpServer;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({ origin: '*' }));

app.use('/signin', require('./api/signin/signin.route'));

if (process.env.NODE_ENV === 'production') {
  protocol = 'http';
  httpServer = http.createServer({}, app);

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

const pull = (req, res) => {
  exec('git pull', (error, stdout) => {
    if (error) return console.error('Git pull failed.');

    if (stdout.trim() === 'Already up to date.') {
      res.send(stdout);
    } else {
      setTimeout(() => {
        exec('pm2 reload 0')
      }, 3000);
      setTimeout(() => {
        exec('pm2 restart 0')
      }, 4000);
      res.send('Pulling..., Server is rebooting.');
    }
  });
}

app.route('/pull').get(pull).post(pull);

(async () => {
  try {
    await mongo(config.mongoUri);
    console.log('Mongo connected');

    httpServer.listen(config.listenPort, () => {
      process.env.NODE_ENV === 'production' ?
        console.log('Listening on https://meet.univern.org') :
        console.log(`Listening on ${protocol}://${config.listenIp}:${config.listenPort}`);
    });
  } catch (e) {
    console.error(e.message ? e.message : e);
  }
})();

socket(new Server(httpServer, { cors: { origin: '*' } }));

process.on('uncaughtException', (err) => {
  console.error(`Caught exception: ${err}`);
});

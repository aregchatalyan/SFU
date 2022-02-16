const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("httpolyglot");
const mediasoup = require("mediasoup");
const app = express();
const { Server } = require("socket.io");
const socket = require("./socket");

const config = require("./config/config");

const options = {
  key: fs.readFileSync(path.join(__dirname, config.sslKey), "utf-8"),
  cert: fs.readFileSync(path.join(__dirname, config.sslCrt), "utf-8"),
};

const httpsServer = https.createServer(options, app);
socket(new Server(httpsServer, { cors: { origin: "*" } }));

app.use(express.static(path.join(__dirname, "client")));

httpsServer.listen(config.listenPort, () =>
  console.log(
    "Listening on https://" + config.listenIp + ":" + config.listenPort
  )
);

process.on("uncaughtException", (err) =>
  console.error(`Caught exception: ${err}`)
);

let workers = [];

(async () => await createWorkers())();

async function createWorkers() {
  let { numWorkers } = config.mediasoup;

  for (let i = 0; i < numWorkers; i++) {
    let worker = await mediasoup.createWorker({
      logLevel: config.mediasoup.worker.logLevel,
      logTags: config.mediasoup.worker.logTags,
      rtcMinPort: config.mediasoup.worker.rtcMinPort,
      rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
    });

    worker.on("died", () => {
      console.error(
        "mediasoup worker died, exiting in 2 seconds... [pid:%d]",
        worker.pid
      );
      setTimeout(() => process.exit(1), 2000);
    });

    workers.push(worker);
  }
}

const mediasoup = require('mediasoup');

const config = require('../config');

let workers = [];
let nextMediasoupWorkerIdx = 0;

(async () => {
  let { CPU, worker: { logLevel, logTags, rtcMinPort, rtcMaxPort } } = config.mediasoup;

  for await (const thread of CPU) {
    const worker = await mediasoup.createWorker({
      logLevel, logTags, rtcMinPort, rtcMaxPort
    });

    worker.on('died', () => {
      console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid);
      setTimeout(() => process.exit(1), 2000);
    });

    workers.push(worker);
  }
})();

module.exports = getMediasoupWorker = () => {
  const worker = workers[nextMediasoupWorkerIdx];

  if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0;

  return worker;
}
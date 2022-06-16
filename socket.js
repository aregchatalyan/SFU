const mediasoup = require('mediasoup');

const Room = require('./helpers/Room');
const Peer = require('./helpers/Peer');
const Question = require('./helpers/Question');
const SignIn = require('./api/sign-in/signin.model');

const config = require('./config');

module.exports = (io) => {
  let workers = [];
  let roomList = new Map();
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

  const getMediasoupWorker = () => {
    const worker = workers[nextMediasoupWorkerIdx];

    if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0;

    return worker;
  }

  io.on('connection', async (socket) => {
    let { roomId, userId } = socket.handshake.query;

    const signInData = await SignIn.findOne({
      id: roomId, 'students.id': { $in: userId }
    }).exec();

    let allowed = false;
    let isTeacher = false;
    let boardPermission = false;
    const teacher_id = signInData?.teacher?.id;

    // const worker = await getMediasoupWorker();

    // if (roomList.has(roomId)) return socket.emit('forbidden', roomId);

    // roomList.set(roomId, new Room(roomId, worker, io, teacher_id));

    if (roomList.has(roomId)) {
      boardPermission = roomList.get(roomId).getUserBoardPermission({ userId });
    }

    if (signInData) {
      if (teacher_id === userId) {
        allowed = true;
        isTeacher = true;
        signInData.students = signInData.students.map((elm) => {
          if (roomList.has(roomId)) {
            elm.boardPermission = roomList
              .get(roomId)
              .getUserBoardPermission({ userId: elm.id });
          } else {
            elm.boardPermission = false;
          }
          return elm;
        });
      } else {
        allowed = signInData.students.filter(({ id }) => id === userId).length > 0;
      }
    }

    if (
      roomList.has(roomId) &&
      Array.from(roomList.get(roomId).peers.values()).some(({ userId: id }) => id === userId)
    ) {
      allowed = false;
    }

    if (signInData && allowed) {
      socket.emit('connected', {
        boardPermission,
        isTeacher,
        ...signInData.toJSON(),
      });

      socket.on('createRoom', async ({ room_id }, callback) => {
        if (roomList.has(room_id)) return callback('already exists');

        console.log('Created room', { room_id: room_id });

        const worker = await getMediasoupWorker();

        roomList.set(roomId, new Room(roomId, worker, io, teacher_id));

        callback(room_id);
      });

      socket.on('join', ({ room_id, userId }, cb) => {
        if (!roomList.has(room_id)) return cb({ error: 'Room does not exist' });

        roomList.get(room_id).checkAndRemoveUser(userId);

        const newPeer = new Peer(socket.id, userId);

        roomList.get(room_id).addPeer(newPeer);

        cb([ newPeer, ...Array.from(roomList.get(room_id).peers.values()) ]);
      });

      socket.on('getProducers', () => {
        if (!roomList.has(roomId)) return;

        console.log('Get producers', { userId: `${roomList.get(roomId).getPeers().get(socket.id).userId}`, });

        // send all the current producer to newly joined member
        let producerList = roomList.get(roomId).getProducerListForPeer();

        socket.emit('newProducers', producerList);
      });

      socket.on('getRouterRtpCapabilities', (_, callback) => {
        console.log('Get RouterRtpCapabilities', { userId: `${roomList.get(roomId).getPeers().get(socket.id).userId}` });

        try {
          callback(roomList.get(roomId).getRtpCapabilities());
        } catch (e) {
          callback({ error: e.message, });
        }
      });

      socket.on('createWebRtcTransport', async (_, callback) => {
        console.log('Create webrtc transport', { userId: `${roomList.get(roomId).getPeers().get(socket.id).userId}` });

        try {
          const { params } = await roomList.get(roomId).createWebRtcTransport(socket.id);

          callback(params);
        } catch (err) {
          console.error(err);
          callback({ error: err.message });
        }
      });

      socket.on('connectTransport', async ({ transport_id, dtlsParameters }, callback) => {
          console.log('Connect transport', { userId: `${roomList.get(roomId).getPeers().get(socket.id).userId}` });

          if (!roomList.has(roomId)) return;

          await roomList.get(roomId).connectPeerTransport(socket.id, transport_id, dtlsParameters);

          callback('success');
        }
      );

      socket.on('produce', async ({ kind, rtpParameters, producerTransportId, isScreenShare }, callback) => {
          if (!roomList.has(roomId)) return callback({ error: 'not is a room' });

          let producer_id = await roomList.get(roomId).produce(
            socket.id,
            producerTransportId,
            rtpParameters,
            kind,
            isScreenShare
          );

          console.log('Produce', {
            type: `${kind}`,
            userId: `${roomList.get(roomId).getPeers().get(socket.id).userId}`,
            id: `${producer_id}`,
          });

          callback({ producer_id });
        }
      );

      socket.on('consume', async ({ consumerTransportId, producerId, rtpCapabilities }, callback) => {
          //TODO null handling
          let params = await roomList.get(roomId).consume(
            socket.id,
            consumerTransportId,
            producerId,
            rtpCapabilities
          );

          console.log('Consuming', {
            userId: `${roomList.get(roomId) && roomList.get(roomId).getPeers().get(socket.id).userId}`,
            producer_id: `${producerId}`,
            consumer_id: `${params.id}`,
          });

          callback(params);
        }
      );

      socket.on('resume', async (data, callback) => {
        await consumer.resume();
        callback();
      });

      socket.on('getMyRoomInfo', (_, cb) => {
        cb(roomList.get(roomId).toJson());
      });

      socket.on('disconnect', async () => {
        if (roomList.has(roomId)) return roomList.delete(roomId);

        console.log(roomId, 'roomId');

        if (!roomId) return;

        await roomList
          .get(roomId)
          .removePeer(socket.id, roomList.get(roomId) && roomList.get(roomId).getPeers().get(socket.id).userId);
      });

      socket.on('producerClosed', ({ producer_id }) => {
        console.log('Producer close', { userId: `${roomList.get(roomId) && roomList.get(roomId).getPeers().get(socket.id).userId}` });
        roomList.get(roomId).closeProducer(socket.id, producer_id);
      });

      socket.on('exitRoom', async (_, callback) => {
        console.log('Exit room', { userId: `${roomList.get(roomId) && roomList.get(roomId).getPeers().get(socket.id).userId}` });

        if (!roomList.has(roomId)) {
          callback({ error: 'not currently in a room' });
          return;
        }

        // close transports
        await roomList.get(roomId).removePeer(
          socket.id,
          roomList.get(roomId) &&
          roomList.get(roomId).getPeers().get(socket.id).userId,
          true
        );
        await roomList.get(roomId);

        if (roomList.get(roomId).getPeers().size === 0) {
          console.log('RoomDeleted');
          roomList.delete(roomId);
        } else {
          console.log('Hello', roomList.get(roomId).getPeers());
        }

        roomId = null;
        callback('successfully exited room');
      });

      socket.on('addMassage', ({ userId, text }) => {
        roomList.get(roomId).addMsg({ userId, text });
      });

      socket.on('getMassages', () => {
        if (!roomList.has(roomId)) return;
        let massage = roomList.get(roomId).getAllMsgs();
        socket.emit('newMassage', massage);
      });

      socket.on('handUp', ({ userId }) => {
        roomList.get(roomId).handUp({ userId });
      });

      socket.on('createPoll', ({ userId, question, versions, anonymous }) => {
        console.log('userId', userId);
        if (!roomList.has(roomId)) return;
        roomList.get(roomId).addQuestion(new Question(userId, question, versions, anonymous));
      });

      socket.on('getPolls', ({ userId }) => {
        if (!roomList.has(roomId)) return;
        let question = roomList.get(roomId).getAllPolls({ userId });
        socket.emit('newPoll', question);
      });

      socket.on('votePoll', ({ userId, questionId, versionId }) => {
        if (!roomList.has(roomId)) return;
        roomList.get(roomId).voteQuestion({ userId, questionId, versionId });
      });

      socket.on('getBoardData', () => {
        if (!roomList.has(roomId)) return;
        const boardData = roomList.get(roomId).getBoardData();
        socket.emit('savedBoardData', boardData);
      });

      socket.on('askPermission', (data) => {
        if (!roomList.has(roomId)) return;
        roomList.get(roomId).askBoardPermission(data);
      });

      socket.on('handlePermission', (data) => {
        if (!roomList.has(roomId)) return;
        roomList.get(roomId).handleBoardPermission(data);
      });

      socket.on('sketching', (data) => {
        if (!roomList.has(roomId)) return;
        roomList.get(roomId).sketchingOnBoard(socket.id, data);
      });

      socket.on('drawing', (data) => {
        if (!roomList.has(roomId)) return;
        console.log('data', data);
        roomList.get(roomId).drawingOnBoard(socket.id, data);
      });

      socket.on('wroteText', (data) => {
        if (!roomList.has(roomId)) return;
        console.log('data', data);
        roomList.get(roomId).addTextOnBoard(socket.id, data);
      });

      socket.on('resetBoard', (data) => {
        if (!roomList.has(roomId)) return;
        roomList.get(roomId).resetBoard(socket.id, data);
      });

      socket.on('undoAction', (data) => {
        if (!roomList.has(roomId)) return;
        roomList.get(roomId).undoBoardAction(socket.id, data);
      });

      socket.on('redoAction', (data) => {
        if (!roomList.has(roomId)) return;
        console.log('dara', data);
        roomList.get(roomId).redoBoardAction(socket.id, data);
      });
    } else {
      return socket.emit('forbidden', roomId);
    }
  });
}

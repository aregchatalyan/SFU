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
    let { numWorkers, worker: { logLevel, logTags, rtcMinPort, rtcMaxPort } } = config.mediasoup;

    for (let i = 0; i < numWorkers; i++) {
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
    const { roomId, userId } = socket.handshake.query;

    const signInData = await SignIn.findOne({
      id: roomId, 'students.id': { $in: userId }
    }).exec();

    let allowed = false;
    let isTeacher = false;
    let boardPermission = false;
    const teacher_id = signInData?.teacher?.id;

    const worker = await getMediasoupWorker();

    if (roomList.has(roomId)) return socket.emit('forbidden', roomId);

    roomList.set(roomId, new Room(roomId, worker, io, teacher_id));

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
        if (roomList.has(room_id)) {
          callback('already exists');
        } else {
          console.log('Created room', { room_id: room_id });

          callback(room_id);
        }
      });

      socket.on('join', ({ room_id, userId }, cb) => {
        if (!roomList.has(room_id)) return cb({ error: 'Room does not exist' });

        roomList.get(room_id).checkAndRemoveUser(userId);

        const newPeer = new Peer(socket.id, userId);
        roomList.get(room_id).addPeer(newPeer);

        socket.room_id = room_id;
        cb([ newPeer, ...Array.from(roomList.get(room_id).peers.values()) ]);
      });

      socket.on('getProducers', () => {
        if (!roomList.has(socket.room_id)) return;

        console.log('Get producers', {
          userId: `${
            roomList.get(socket.room_id).getPeers().get(socket.id).userId
          }`,
        });

        // send all the current producer to newly joined member
        let producerList = roomList
          .get(socket.room_id)
          .getProducerListForPeer();

        socket.emit('newProducers', producerList);
      });

      socket.on('getRouterRtpCapabilities', (_, callback) => {
        console.log('Get RouterRtpCapabilities', {
          userId: `${
            roomList.get(socket.room_id).getPeers().get(socket.id).userId
          }`,
        });

        try {
          callback(roomList.get(socket.room_id).getRtpCapabilities());
        } catch (e) {
          callback({
            error: e.message,
          });
        }
      });

      socket.on('createWebRtcTransport', async (_, callback) => {
        console.log('Create webrtc transport', {
          userId: `${
            roomList.get(socket.room_id).getPeers().get(socket.id).userId
          }`,
        });

        try {
          const { params } = await roomList
            .get(socket.room_id)
            .createWebRtcTransport(socket.id);

          callback(params);
        } catch (err) {
          console.error(err);
          callback({
            error: err.message,
          });
        }
      });

      socket.on(
        'connectTransport',
        async ({ transport_id, dtlsParameters }, callback) => {
          console.log('Connect transport', {
            userId: `${
              roomList.get(socket.room_id).getPeers().get(socket.id).userId
            }`,
          });

          if (!roomList.has(socket.room_id)) return;
          await roomList
            .get(socket.room_id)
            .connectPeerTransport(socket.id, transport_id, dtlsParameters);

          callback('success');
        }
      );

      socket.on(
        'produce',
        async (
          { kind, rtpParameters, producerTransportId, isScreenShare },
          callback
        ) => {
          if (!roomList.has(socket.room_id))
            return callback({ error: 'not is a room' });

          let producer_id = await roomList
            .get(socket.room_id)
            .produce(
              socket.id,
              producerTransportId,
              rtpParameters,
              kind,
              isScreenShare
            );

          console.log('Produce', {
            type: `${kind}`,
            userId: `${
              roomList.get(socket.room_id).getPeers().get(socket.id).userId
            }`,
            id: `${producer_id}`,
          });

          callback({ producer_id });
        }
      );

      socket.on(
        'consume',
        async (
          { consumerTransportId, producerId, rtpCapabilities },
          callback
        ) => {
          //TODO null handling
          let params = await roomList
            .get(socket.room_id)
            .consume(
              socket.id,
              consumerTransportId,
              producerId,
              rtpCapabilities
            );

          // console.log("Consuming", {
          //   userId: `${
          //     roomList.get(socket.room_id) &&
          //     roomList.get(socket.room_id).getPeers().get(socket.id).userId
          //   }`,
          //   producer_id: `${producerId}`,
          //   consumer_id: `${params.id}`,
          // });

          callback(params);
        }
      );

      socket.on('resume', async (data, callback) => {
        await consumer.resume();

        callback();
      });

      socket.on('getMyRoomInfo', (_, cb) => {
        cb(roomList.get(socket.room_id).toJson());
      });

      socket.on('disconnect', async () => {
        if (roomList.has(roomId)) return roomList.delete(roomId);

        if (!socket.room_id) return;

        await roomList
          .get(socket.room_id)
          .removePeer(
            socket.id,
            roomList.get(socket.room_id) &&
            roomList.get(socket.room_id).getPeers().get(socket.id).userId
          );
      });

      socket.on('producerClosed', ({ producer_id }) => {
        console.log('Producer close', {
          userId: `${
            roomList.get(socket.room_id) &&
            roomList.get(socket.room_id).getPeers().get(socket.id).userId
          }`,
        });

        roomList.get(socket.room_id).closeProducer(socket.id, producer_id);
      });

      socket.on('exitRoom', async (_, callback) => {
        console.log('Exit room', {
          userId: `${
            roomList.get(socket.room_id) &&
            roomList.get(socket.room_id).getPeers().get(socket.id).userId
          }`,
        });

        if (!roomList.has(socket.room_id)) {
          callback({
            error: 'not currently in a room',
          });
          return;
        }

        // close transports
        await roomList
          .get(socket.room_id)
          .removePeer(
            socket.id,
            roomList.get(socket.room_id) &&
            roomList.get(socket.room_id).getPeers().get(socket.id).userId,
            true
          );
        await roomList.get(socket.room_id);

        if (roomList.get(socket.room_id).getPeers().size === 0) {
          console.log('RoomDeleted');
          roomList.delete(socket.room_id);
        } else {
          console.log('Hello', roomList.get(socket.room_id).getPeers());
        }
        socket.room_id = null;
        callback('successfully exited room');
      });

      socket.on('addMassage', ({ userId, text }) => {
        roomList.get(socket.room_id).addMsg({ userId, text });
      });

      socket.on('getMassages', () => {
        if (!roomList.has(socket.room_id)) return;
        let massage = roomList.get(socket.room_id).getAllMsgs();
        socket.emit('newMassage', massage);
      });

      socket.on('handUp', ({ userId }) => {
        roomList.get(socket.room_id).handUp({ userId });
      });

      socket.on('createPoll', ({ userId, question, versions, anonymous }) => {
        console.log('userId', userId);
        if (!roomList.has(socket.room_id)) return;
        roomList
          .get(socket.room_id)
          .addQuestion(new Question(userId, question, versions, anonymous));
      });

      socket.on('getPolls', ({ userId }) => {
        if (!roomList.has(socket.room_id)) return;
        let question = roomList.get(socket.room_id).getAllPolls({ userId });
        socket.emit('newPoll', question);
      });

      socket.on('votePoll', ({ userId, questionId, versionId }) => {
        if (!roomList.has(socket.room_id)) return;
        roomList
          .get(socket.room_id)
          .voteQuestion({ userId, questionId, versionId });
      });

      socket.on('getBoardData', () => {
        if (!roomList.has(socket.room_id)) return;

        const boardData = roomList.get(socket.room_id).getBoardData();

        socket.emit('savedBoardData', boardData);
      });

      socket.on('askPermission', (data) => {
        if (!roomList.has(socket.room_id)) return;
        roomList.get(socket.room_id).askBoardPermission(data);
      });

      socket.on('handlePermission', (data) => {
        if (!roomList.has(socket.room_id)) return;
        roomList.get(socket.room_id).handleBoardPermission(data);
      });

      socket.on('sketching', (data) => {
        if (!roomList.has(socket.room_id)) return;

        roomList.get(socket.room_id).sketchingOnBoard(socket.id, data);
      });

      socket.on('drawing', (data) => {
        if (!roomList.has(socket.room_id)) return;
        console.log('data', data);
        roomList.get(socket.room_id).drawingOnBoard(socket.id, data);
      });

      socket.on('wroteText', (data) => {
        if (!roomList.has(socket.room_id)) return;
        console.log('data', data);
        roomList.get(socket.room_id).addTextOnBoard(socket.id, data);
      });

      socket.on('resetBoard', (data) => {
        if (!roomList.has(socket.room_id)) return;
        roomList.get(socket.room_id).resetBoard(socket.id, data);
      });

      socket.on('undoAction', (data) => {
        if (!roomList.has(socket.room_id)) return;
        roomList.get(socket.room_id).undoBoardAction(socket.id, data);
      });

      socket.on('redoAction', (data) => {
        if (!roomList.has(socket.room_id)) return;
        console.log('dara', data);
        roomList.get(socket.room_id).redoBoardAction(socket.id, data);
      });
    } else {
      return socket.emit('forbidden', roomId);
    }
  });
}

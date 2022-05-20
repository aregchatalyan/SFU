const config = require("../config");
const Board = require("./Board");

module.exports = class Room {
  constructor(room_id, worker, io, teacher_id) {
    this.id = room_id;

    const mediaCodecs = config.mediasoup.router.mediaCodecs;

    worker
      .createRouter({
        mediaCodecs,
      })
      .then(
        function (router) {
          this.router = router;
        }.bind(this)
      );

    this.peers = new Map();
    this.waitingList = new Map();
    this.questions = new Map();
    this.io = io;
    this.massages = [];
    this.board = new Board(teacher_id, io);
    this.teacher_id = teacher_id;
    this.waitingTime = 5;
    this.interval = null;
  }

  startInterval() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      console.log("interval is working", this.waitingList.size);
      if (this.waitingList.size === 0) {
        this.endInterval();
      }
      this.waitingList.forEach(({ createdAt, socket_id }, id) => {
        if (Date.now() - createdAt >= 10000) {
          this.broadCast(socket_id, "userLeft", { socket_id });
          this.waitingList.delete(id);
        }
      });
    }, 1000);
  }

  endInterval() {
    console.log("end interval");
    clearInterval(this.interval);
  }

  addMsg = ({ userId, text }) => {
    this.massages.push({ userId, text });
    this.broadCast("", "newMassage", [{ userId, text }]);
  };
  getAllMsgs = () => {
    return this.massages;
  };

  handUp = ({ userId }) => {
    this.broadCast("", "newHandUp", [{ userId }]);
  };

  addPeer(peer) {
    this.peers.set(peer.id, peer);
    console.log("UserId:::", peer.userId);
    this.broadCast(peer.id, "newUsers", [peer]);
    if (peer.userId === this.teacher_id) {
      this.broadCast(peer.id, "teacherJoin", { joined: true });
    } else {
      const joined = Array.from(this.peers.values()).some(
        ({ userId }) => this.teacher_id === userId
      );
      this.send(peer.id, "teacherJoin", { joined });
    }
  }

  addQuestion(question) {
    this.questions.set(question.id, question);
    console.log("questions", this.questions);
    this.broadCast("", "newPoll", [question.getBroadcastData({ userId: "" })]);
  }

  getAllPolls({ userId }) {
    let questionList = [];
    this.questions.forEach((question) => {
      questionList.unshift(question.getBroadcastData({ userId }));
    });
    return questionList;
  }
  voteQuestion({ userId, questionId, versionId }) {
    if (!this.questions.has(questionId)) return;
    const votersIds = this.questions
      .get(questionId)
      .vote({ userId, versionId });

    console.log(`VotersIds : `, votersIds);
    this.broadCastOnlySelected(
      "newVote",
      this.questions.get(questionId),
      votersIds
    );
  }

  getProducerListForPeer() {
    let producerList = [];

    this.peers.forEach((peer) => {
      peer.producers.forEach((producer) => {
        producerList.push({
          producer_id: producer.id,
          producer_socket_id: peer.id,
          isScreenShare: producer.appData.isScreenShare,
        });
      });
    });

    return producerList;
  }

  getRtpCapabilities() {
    return this.router.rtpCapabilities;
  }

  async createWebRtcTransport(socket_id) {
    const { maxIncomingBitrate, initialAvailableOutgoingBitrate } =
      config.mediasoup.webRtcTransport;

    const transport = await this.router.createWebRtcTransport({
      listenIps: config.mediasoup.webRtcTransport.listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate,
    });

    if (maxIncomingBitrate) {
      try {
        await transport.setMaxIncomingBitrate(maxIncomingBitrate);
      } catch (error) {}
    }

    transport.on(
      "dtlsstatechange",
      function (dtlsState) {
        if (dtlsState === "closed") {
          console.log("Transport close", {
            userId: this.peers.get(socket_id).userId,
          });
          transport.close();
        }
      }.bind(this)
    );

    transport.on("close", () =>
      console.log("Transport close", {
        userId: this.peers.get(socket_id).userId,
      })
    );

    console.log("Adding transport", { transportId: transport.id });

    this.peers.get(socket_id).addTransport(transport);

    return {
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      },
    };
  }

  async connectPeerTransport(socket_id, transport_id, dtlsParameters) {
    if (!this.peers.has(socket_id)) return;

    await this.peers
      .get(socket_id)
      .connectTransport(transport_id, dtlsParameters);
  }

  async produce(
    socket_id,
    producerTransportId,
    rtpParameters,
    kind,
    isScreenShare
  ) {
    // handle undefined errors
    return new Promise(
      async function (resolve, reject) {
        let producer = await this.peers
          .get(socket_id)
          .createProducer(
            producerTransportId,
            rtpParameters,
            kind,
            isScreenShare
          );

        resolve(producer.id);
        this.broadCast(socket_id, "newProducers", [
          {
            producer_id: producer.id,
            producer_socket_id: socket_id,
            isScreenShare,
          },
        ]);
      }.bind(this)
    );
  }

  async consume(
    socket_id,
    consumer_transport_id,
    producer_id,
    rtpCapabilities
  ) {
    // handle nulls
    if (!this.router.canConsume({ producerId: producer_id, rtpCapabilities })) {
      console.error("can not consume");
      return;
    }

    let { consumer, params } = await this.peers
      .get(socket_id)
      .createConsumer(consumer_transport_id, producer_id, rtpCapabilities);

    consumer.on(
      "producerclose",
      function () {
        console.log("Consumer closed due to producerclose event", {
          userId: `${this.peers.get(socket_id).userId}`,
          consumer_id: `${consumer.id}`,
        });

        this.peers.get(socket_id).removeConsumer(consumer.id);
        // tell client consumer is dead
        this.io
          .to(socket_id)
          .emit("consumerClosed", { consumer_id: consumer.id });
      }.bind(this)
    );

    return params;
  }

  async removePeer(socket_id, userId, exited) {
    this.peers.get(socket_id).close();
    this.peers.delete(socket_id);

    if (exited) {
      this.broadCast(socket_id, "userLeft", { socket_id });
    } else {
      this.waitingList.set(userId, { socket_id, createdAt: Date.now() });
      this.startInterval();
      this.broadCast(socket_id, "userConnectionProblem", { userId });
    }

    if (userId === this.teacher_id) {
      this.broadCast(socket_id, "teacherJoin", { joined: false });
    }
  }
  checkAndRemoveUser(userId) {
    if (!this.waitingList.has(userId)) return;
    this.waitingList.delete(userId);
  }

  closeProducer(socket_id, producer_id) {
    this.peers.get(socket_id).closeProducer(producer_id);
  }

  broadCast(socket_id, connectionName, data) {
    for (let otherID of Array.from(this.peers.keys()).filter(
      (id) => id !== socket_id
    )) {
      this.send(otherID, connectionName, data);
    }
  }
  sendToCurrentUserById(userId, connectionName, data) {
    for (let user of Array.from(this.peers.values())) {
      if (user.userId === userId) {
        this.send(user.id, connectionName, data);
        return;
      }
    }
  }

  broadCastOnlySelected(connectionName, question, usersId = []) {
    for (const { id, userId } of Array.from(this.peers.values())) {
      if (usersId.includes(userId)) {
        this.send(id, connectionName, question.getBroadcastData({ userId }));
      }
    }
  }

  send(socket_id, connectionName, data) {
    this.io.to(socket_id).emit(connectionName, data);
  }

  getPeers() {
    return this.peers;
  }

  toJson() {
    return {
      id: this.id,
      peers: JSON.stringify([...this.peers]),
    };
  }

  getUserBoardPermission(data) {
    return this.board.userHasPermission(data);
  }

  handleBoardPermission(data) {
    this.sendToCurrentUserById(
      this.board.givePermission(data),
      "myBoardPermission",
      { allowed: data.allowed }
    );
  }

  sketchingOnBoard(socketId, data) {
    if (this.board.sketching(data)) {
      this.broadCast(socketId, "newSketching", data);
    }
  }

  drawingOnBoard(socketId, data) {
    if (this.board.drawing(data)) {
      this.broadCast(socketId, "newDrawing", data);
    }
  }
  addTextOnBoard(socketId, data) {
    if (this.board.writeText(data)) {
      this.broadCast(socketId, "newText", data);
    }
  }

  askBoardPermission({ userId }) {
    this.sendToCurrentUserById(this.board.teacher_id, "askToJoin", {
      type: "ask_permission",
      userId,
    });
  }
  resetBoard(socketId, data) {
    if (this.board.reset(data)) {
    }
    this.broadCast(socketId, "boardReset", data);
  }
  undoBoardAction(socketId, data) {
    this.board.undoActionByUserId(data);
    this.broadCast(socketId, "undoUserAction", data);
  }
  redoBoardAction(socketId, data) {
    this.board.redoBoardAction(data);
    this.broadCast(socketId, "redoUserAction", data);
  }

  getBoardData() {
    return this.board.getBoardData();
  }
};

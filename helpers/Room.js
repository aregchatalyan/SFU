const config = require("../config/config");

module.exports = class Room {
  constructor(room_id, worker, io) {
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
    this.questions = new Map();
    this.io = io;
    this.massages = [];
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
    const userList = this.getAllUsers();
    this.broadCast(peer.id, "newUsers", userList);
  }

  addQuestion(question) {
    this.questions.set(question.id, question);
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
        });
      });
    });

    return producerList;
  }
  getAllUsers() {
    let userList = [];
    this.peers.forEach((peer) => {
      userList.push(peer);
    });
    return userList;
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

  async produce(socket_id, producerTransportId, rtpParameters, kind) {
    // handle undefined errors
    return new Promise(
      async function (resolve, reject) {
        let producer = await this.peers
          .get(socket_id)
          .createProducer(producerTransportId, rtpParameters, kind);

        resolve(producer.id);
        this.broadCast(socket_id, "newProducers", [
          {
            producer_id: producer.id,
            producer_socket_id: socket_id,
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

  async removePeer(socket_id) {
    this.peers.get(socket_id).close();
    this.peers.delete(socket_id);
    this.broadCast(socket_id, "userLeft", { socket_id });
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
};

let producer = null;
let isEnumerateDevices = false;

const _EVENTS = {
  exitRoom: "exitRoom",
  openRoom: "openRoom",
  startVideo: "startVideo",
  stopVideo: "stopVideo",
  startAudio: "startAudio",
  stopAudio: "stopAudio",
  startScreen: "startScreen",
  stopScreen: "stopScreen",
};
const mediaType = {
  audio: "audioType",
  video: "videoType",
  screen: "screenType",
};

let device = null;
let consumers = new Map();
const eventListeners = new Map();
const producerLabel = new Map();
const producers = new Map();

let consumerTransport = null;
let producerTransport = null;

const Request = function request(type, data = {}, socket) {
  return new Promise((resolve, reject) => {
    socket.emit(type, data, (data) => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data);
      }
    });
  });
};

const loadDevice = async function (routerRtpCapabilities) {
  let device;
  try {
    device = new window.mediasoupClient.Device();
    console.log("Device :", device);
  } catch (error) {
    if (error.name === "UnsupportedError") {
      console.error("Browser not supported");
      alert("Browser not supported");
    }
    console.error(error);
  }
  await device.load({
    routerRtpCapabilities,
  });
  console.log("Device", device);
  return device;
};

const initTransports = async function (device, socket) {
  // init producerTransport
  {
    const data = await Request(
      "createWebRtcTransport",
      {
        forceTcp: false,
        rtpCapabilities: device.rtpCapabilities,
      },
      socket
    );

    if (data.error) {
      console.error(data.error);
      return;
    }

    producerTransport = device.createSendTransport(data);

    producerTransport.on(
      "connect",
      async function ({ dtlsParameters }, callback, errback) {
        Request(
          "connectTransport",
          {
            dtlsParameters,
            transport_id: data.id,
          },
          socket
        )
          .then(callback)
          .catch(errback);
      }
    );

    producerTransport.on(
      "produce",
      async function ({ kind, rtpParameters }, callback, errback) {
        try {
          const { producer_id } = await Request(
            "produce",
            {
              producerTransportId: producerTransport.id,
              kind,
              rtpParameters,
            },
            socket
          );
          callback({
            id: producer_id,
          });
        } catch (err) {
          errback(err);
        }
      }
    );

    producerTransport.on("connectionstatechange", function (state) {
      switch (state) {
        case "connecting":
          break;

        case "connected":
          //localVideo.srcObject = stream
          break;

        case "failed":
          producerTransport.close();
          break;

        default:
          break;
      }
    });
  }

  // init consumerTransport
  {
    const data = await Request(
      "createWebRtcTransport",
      {
        forceTcp: false,
      },
      socket
    );

    if (data.error) {
      console.error(data.error);
      return;
    }

    // only one needed
    consumerTransport = device.createRecvTransport(data);
    consumerTransport.on(
      "connect",
      function ({ dtlsParameters }, callback, errback) {
        Request(
          "connectTransport",
          {
            transport_id: consumerTransport.id,
            dtlsParameters,
          },
          socket
        )
          .then(callback)
          .catch(errback);
      }
    );

    consumerTransport.on("connectionstatechange", async function (state) {
      switch (state) {
        case "connecting":
          break;

        case "connected":
          //remoteVideo.srcObject = await stream;
          //await Request('resume');
          break;

        case "failed":
          consumerTransport.close();
          break;

        default:
          break;
      }
    });
  }
};

const join = async function (userId, room_id, socket) {
  Request(
    "join",
    {
      userId,
      room_id,
    },
    socket
  )
    .then(async function (e) {
      console.log("Joined to room", e);
      const data = await Request("getRouterRtpCapabilities", {}, socket);
      device = await loadDevice(data);

      await initTransports(device, socket);
      socket.emit("getUsers");
      socket.emit("getProducers");
      socket.emit("getMassages");
      socket.emit("getPolls");
    })
    .catch((err) => {
      console.log("Join error:", err);
    });
};

const removeConsumer = function (consumer_id, callback) {
  console.log("PRODCUER CLOSE : ", consumer_id);
  callback((state) =>
    state.map((elm) => {
      if (elm.consumerId === consumer_id) {
        elm.stream = undefined;
        elm.consumerId = undefined;
      }
      return elm;
    })
  );
};
const getAudioTracks = async function (producerId, socket) {
  const { rtpCapabilities } = device;
  const data = await Request(
    "consume",
    {
      rtpCapabilities,
      consumerTransportId: consumerTransport.id, // might be
      producerId,
    },
    socket
  );
  const { id, kind, rtpParameters } = data;

  let codecOptions = {};
  const consumer = await consumerTransport.consume({
    id,
    producerId,
    kind,
    rtpParameters,
    codecOptions,
  });

  const stream = new MediaStream();
  stream.addTrack(consumer.track);

  return {
    consumer,
    stream,
    kind,
  };
};
const getConsumeStream = async function (producerId, socket) {
  const { rtpCapabilities } = device;
  const data = await Request(
    "consume",
    {
      rtpCapabilities,
      consumerTransportId: consumerTransport.id, // might be
      producerId,
    },
    socket
  );
  const { id, kind, rtpParameters } = data;

  let codecOptions = {};
  const consumer = await consumerTransport.consume({
    id,
    producerId,
    kind,
    rtpParameters,
    codecOptions,
  });

  const stream = new MediaStream();
  stream.addTrack(consumer.track);

  return {
    consumer,
    stream,
    kind,
  };
};
export const consume = async function (
  producer_id,
  socket,
  producer_socket_id,
  userList
) {
  const { consumer, stream, kind } = await getConsumeStream(
    producer_id,
    socket
  );
  consumers.set(consumer.id, consumer);
  consumer.on("trackended", function () {
    removeConsumer(consumer.id);
  });
  consumer.on("transportclose", function () {
    removeConsumer(consumer.id);
  });
  let res;

  if (kind === "video") {
    res = userList.map((elm) => {
      if (elm.id === producer_socket_id) {
        elm.stream = stream;
        elm.consumerId = consumer.id;
      }
      return elm;
    });
  }
  console.log("RES : ", res);
  return res;
  // getConsumeStream(producer_id, socket).then(function ({
  //   consumer,
  //   stream,
  //   kind,
  // }) {
  //   let elem;
  //   let res;

  // else {
  //     elem = document.createElement("audio");
  //     elem.srcObject = stream;
  //     elem.id = consumer.id;
  //     elem.playsinline = false;
  //     elem.autoplay = true;
  //     //remoteAudios.appendChild(elem)
  //   }

  //
  //   return res;
  // });
};
const events = function (evt) {
  if (eventListeners.has(evt)) {
    eventListeners.get(evt).forEach((callback) => callback());
  }
};

export const exit = function (offline = false, socket, callBack) {
  let clean = function () {
    consumerTransport.close();
    producerTransport.close();
    socket.off("disconnect");
    socket.off("newUsers");
    socket.off("newMassage");
    socket.off("newPoll");
    socket.off("newHandUp");
    socket.off("newProducers");
    socket.off("consumerClosed");
    socket.off("userLeft");
  };

  if (!offline) {
    Request("exitRoom", {}, socket)
      .then((e) => console.log(e))
      .catch((e) => console.warn(e))
      .finally(function () {
        clean();
        callBack();
      });
  } else {
    clean();
  }

  events(_EVENTS.exitRoom);
};

const initSocket = function (
  socket,
  setUsers,
  setProducers,
  setMassages,
  setHands
) {
  socket.on("consumerClosed", function ({ consumer_id }) {
    console.log("Closing consumer:", consumer_id);
    removeConsumer(consumer_id, setUsers);
  });
  socket.on("newProducers", async function (data) {
    console.log("New VIdeo", data);
    setProducers([...data]);
  });
  socket.on("newUsers", async function (data) {
    await setUsers(data);
    console.log("New users", data);
  });

  socket.on("newMassage", async function (data) {
    setMassages((state) => [...state, ...data]);
  });

  socket.on("newPoll", function (data) {
    console.log("New Poll : ", data);
    // setMassages((state) => [...state, ...data]);
  });

  socket.on("newHandUp", async function (data) {
    setHands((state) => [...state, ...data]);
    console.log("HandUp", data);
  });

  socket.on("userLeft", async ({ socket_id }) => {
    setUsers((state) => {
      const res = [...state].filter((elm) => {
        if (elm.id === socket_id) {
          elm.stream = undefined;
          elm.consumerId = undefined;
          setProducers([]);
          return false;
        }
        return true;
      });
      return res;
    });
  });
  socket.on("disconnect", function () {
    console.log("HELLO");
    exit(true, socket);
  });
};

const createRoom = async function (room_id, socket) {
  await Request(
    "createRoom",
    {
      room_id,
    },
    socket
  ).catch((err) => {
    console.log("Create room error:", err);
  });
};

export const joinRoom = async function (
  userId,
  room_id,
  socket,
  setUsers,
  setProducers,
  setMassages,
  setHands
) {
  await createRoom(room_id, socket).then(async function () {
    await join(userId, room_id, socket);
    initSocket(socket, setUsers, setProducers, setMassages, setHands);
  });
};

function initEnumerateDevices() {
  // Many browsers, without the consent of getUserMedia, cannot enumerate the devices.
  if (isEnumerateDevices) return;

  const constraints = {
    audio: true,
    video: true,
  };

  window.navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      enumerateDevices();
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
    })
    .catch((err) => {
      console.error("Access denied for audio/video: ", err);
    });
}

function enumerateDevices() {
  // Load mediaDevice options
  window.navigator.mediaDevices.enumerateDevices().then((devices) =>
    devices.forEach((device) => {
      let el = null;
      if ("audioinput" === device.kind) {
        // el = audioSelect
      } else if ("videoinput" === device.kind) {
        //el = videoSelect
      }
      if (!el) return;

      let option = document.createElement("option");
      option.value = device.deviceId;
      option.innerText = device.label;
      el.appendChild(option);
      isEnumerateDevices = true;
    })
  );
}

export const produce = async function (
  type,
  deviceId = null,
  socket,
  setStream
) {
  let mediaConstraints = {};
  let audio = false;
  let screen = false;
  let stream = {};
  switch (type) {
    case mediaType.audio:
      mediaConstraints = {
        audio: {
          deviceId: deviceId,
        },
        video: false,
      };
      audio = true;
      break;
    case mediaType.video:
      mediaConstraints = {
        audio: false,
        video: {
          width: {
            min: 640,
            ideal: 1920,
          },
          height: {
            min: 400,
            ideal: 1080,
          },
          deviceId: deviceId,
        },
      };
      break;
    case mediaType.screen:
      mediaConstraints = false;
      screen = true;
      break;
    default:
      return;
  }
  console.log("DEVICECANPRODUCE : ", device);
  // if (!device.canProduce("video") && !audio) {
  //   console.error("Cannot produce video");
  //   return;
  // }
  if (producerLabel.has(type)) {
    console.log("Producer already exists for this type " + type);
    return;
  }
  console.log("Mediacontraints:", mediaConstraints);
  // let stream;
  try {
    stream = screen
      ? await window.navigator.mediaDevices.getDisplayMedia()
      : await window.navigator.mediaDevices.getUserMedia(mediaConstraints);
    const track = audio
      ? stream.getAudioTracks()[0]
      : stream.getVideoTracks()[0];
    const params = {
      track,
    };
    if (!audio && !screen) {
      params.encodings = [
        {
          rid: "r0",
          maxBitrate: 100000,
          //scaleResolutionDownBy: 10.0,
          scalabilityMode: "S1T3",
        },
        {
          rid: "r1",
          maxBitrate: 300000,
          scalabilityMode: "S1T3",
        },
        {
          rid: "r2",
          maxBitrate: 900000,
          scalabilityMode: "S1T3",
        },
      ];
      params.codecOptions = {
        videoGoogleStartBitrate: 1000,
      };
    }
    console.log("TRANSPORT : ", producerTransport);
    producer = await producerTransport.produce(params);

    console.log("Producer", producer);

    producers.set(producer.id, producer);

    let elem;
    if (!audio) {
      setStream(stream);
      //   elem = document.createElement("video");
      //   elem.srcObject = stream;
      //   elem.id = producer.id;
      //   elem.playsinline = false;
      //   elem.autoplay = true;
      //   elem.className = "vid";
      //   document.getElementById("localMedia").appendChild(elem);
      //   //handleFS(elem.id);
    }

    producer.on("trackended", () => {
      closeProducer(type, socket);
    });

    producer.on("transportclose", () => {
      console.log("Producer transport close");
      if (!audio) {
        elem.srcObject.getTracks().forEach(function (track) {
          track.stop();
        });
        elem.parentNode.removeChild(elem);
      }
      producers.delete(producer.id);
    });

    producer.on("close", () => {
      console.log("Closing producer");
      if (!audio) {
        elem.srcObject.getTracks().forEach(function (track) {
          track.stop();
        });
        elem.parentNode.removeChild(elem);
      }
      producers.delete(producer.id);
    });

    producerLabel.set(type, producer.id);

    switch (type) {
      case mediaType.audio:
        events(_EVENTS.startAudio);
        break;
      case mediaType.video:
        events(_EVENTS.startVideo);
        break;
      case mediaType.screen:
        events(_EVENTS.startScreen);
        break;
      default:
        return;
    }
  } catch (err) {
    console.log("Produce error:", err);
  }
};
export const closeProducer = function (type, socket, callback) {
  console.log("CLOSED : ", socket);
  if (!producerLabel.has(type)) {
    console.log("There is no producer for this type " + type);
    return;
  }
  let producer_id = producerLabel.get(type);
  socket.emit("producerClosed", {
    producer_id,
  });
  producers.get(producer_id).close();
  producers.delete(producer_id);
  producerLabel.delete(type);
  callback(undefined);
  // if (type !== mediaType.audio) {
  //   let elem = document.getElementById(producer_id);
  //   elem.srcObject.getTracks().forEach(function (track) {
  //     track.stop();
  //   });
  //   elem.parentNode.removeChild(elem);
  // }
  switch (type) {
    case mediaType.audio:
      events(_EVENTS.stopAudio);
      break;
    case mediaType.video:
      events(_EVENTS.stopVideo);
      break;
    case mediaType.screen:
      events(_EVENTS.stopScreen);
      break;
    default:
      return;
  }
};

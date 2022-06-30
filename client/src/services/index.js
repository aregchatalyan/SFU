import { Device } from 'mediasoup-client'

let producer = null

const mediaType = {
  audio: 'audioType',
  video: 'videoType',
  screen: 'screenType',
}

let device = null
const producerLabel = new Map()
const producers = new Map()

let consumerTransport = null
let producerTransport = null

const request = (type, data = {}, socket) => new Promise((resolve, reject) => {
  console.log(type, 'EMIT', data)

  socket.emit(type, data, (data) => {
    console.log(type, 'CALLBACK', data)

    data.error ? reject(data.error) : resolve(data)
  })
})

const loadDevice = async function (routerRtpCapabilities) {
  try {
    device = new Device()
  } catch (error) {
    if (error.name === 'UnsupportedError') {
      console.error('Browser not supported')
      alert('Browser not supported')
    }
    console.error(error)
  }
  await device.load({
    routerRtpCapabilities,
  })
  return device
}

const initTransports = async function (device, socket) {
  {
    const data = await request(
      'createWebRtcTransport',
      {
        forceTcp: false,
        rtpCapabilities: device.rtpCapabilities,
      },
      socket
    )

    if (data.error) {
      console.error(data.error)
      return
    }

    producerTransport = device.createSendTransport(data)

    producerTransport.on(
      'connect',
      async function ({ dtlsParameters }, callback, errback) {
        request(
          'connectTransport',
          {
            dtlsParameters,
            transport_id: data.id,
          },
          socket
        )
          .then(callback)
          .catch(errback)
      }
    )

    producerTransport.on(
      'produce',
      async function (
        { kind, rtpParameters, appData: { isScreenShare } },
        callback,
        errback
      ) {
        try {
          const { producer_id } = await request(
            'produce',
            {
              producerTransportId: producerTransport.id,
              kind,
              rtpParameters,
              isScreenShare,
            },
            socket
          )
          callback({
            id: producer_id,
          })
        } catch (err) {
          errback(err)
        }
      }
    )

    producerTransport.on('connectionstatechange', function (state) {
      switch (state) {
        case 'connecting':
          break

        case 'connected':
          break

        case 'failed':
          console.log('state', state)
          producerTransport.close()
          break

        default:
          break
      }
    })
  }

  // init consumerTransport
  {
    const data = await request(
      'createWebRtcTransport',
      {
        forceTcp: false,
      },
      socket
    )

    if (data.error) {
      console.error(data.error)
      return
    }

    // only one needed
    consumerTransport = device.createRecvTransport(data)
    consumerTransport.on(
      'connect',
      function ({ dtlsParameters }, callback, errback) {
        request(
          'connectTransport',
          {
            transport_id: consumerTransport.id,
            dtlsParameters,
          },
          socket
        )
          .then(callback)
          .catch(errback)
      }
    )

    consumerTransport.on('connectionstatechange', async function (state) {
      switch (state) {
        case 'connecting':
          break

        case 'connected':
          //remoteVideo.srcObject = await stream;
          //await request('resume');
          break

        case 'failed':
          consumerTransport.close()
          break

        default:
          break
      }
    })
  }
}

const join = async function (userId, room_id, socket, setUsers, getUserById) {
  await request(
    'join',
    {
      userId,
      room_id,
    },
    socket
  )
    .then(async function (res) {
      const users = res.map((elm) => ({ ...getUserById(elm.userId), ...elm }))
      setUsers(users)
      const data = await request('getRouterRtpCapabilities', {}, socket)
      device = await loadDevice(data)

      await initTransports(device, socket)
      socket.emit('getProducers')
      socket.emit('getMassages')
      socket.emit('getPolls', { userId })
      return device
    })
    .catch((err) => {
      console.log('Join error:', err)
    })
}

export const removeConsumer = function (consumer_id, callback) {
  console.log('PRODCUER CLOSE : ', consumer_id)
  callback &&
  callback((state) => {
    return [ ...state ].map((elm) => {
      if (elm.consumerId === consumer_id) {
        elm.stream = undefined
        elm.consumerId = undefined
      } else if (elm.screenConsumerId === consumer_id) {
        elm.screenStream = undefined
        elm.screenConsumerId = undefined
      }
      if (elm.audioConsumerId === consumer_id) {
        elm.audioStream = undefined
        elm.audioConsumerId = undefined
        console.log('audio_remove', elm.audioStream)
      }
      return elm
    })
  })
}

const getConsumeStream = async function (producerId, socket) {
  const { rtpCapabilities } = device
  const data = await request(
    'consume',
    {
      rtpCapabilities,
      consumerTransportId: consumerTransport.id, // might be
      producerId,
    },
    socket
  )
  const { id, kind, rtpParameters } = data || {
    id: undefined,
    kind: undefined,
    rtpParameters: undefined,
  }

  let codecOptions = {}
  if (id) {
    const consumer = await consumerTransport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
      codecOptions,
    })

    const stream = new MediaStream()
    stream.addTrack(consumer.track)

    return {
      consumer,
      stream,
      kind,
    }
  } else {
    return undefined
  }
}
export const consume = async function (
  producer_id,
  socket,
  producer_socket_id,
  userList,
  isScreenShare
) {
  console.log('producer_id', producer_id)
  const data = await getConsumeStream(producer_id, socket)

  if (!data) return

  const { consumer, stream, kind } = data

  consumer.on('trackended', function () {
    console.log('trackend ::')
    removeConsumer(consumer.id)
  })
  consumer.on('transportclose', function () {
    removeConsumer(consumer.id)
  })
  let res

  if (kind === 'video') {
    res = userList.map((elm) => {
      if (elm.id === producer_socket_id) {
        if (isScreenShare) {
          elm.screenStream = stream
          elm.screenConsumerId = consumer.id
        } else {
          elm.stream = stream
          elm.consumerId = consumer.id
        }
      }
      return elm
    })
  } else if (kind === 'audio') {
    res = userList.map((elm) => {
      if (elm.id === producer_socket_id) {
        elm.audioStream = stream
        elm.audioConsumerId = consumer.id
      }
      return elm
    })
  }
  return res
}

export const exit = function (offline = false, socket, callBack) {
  let clean = function () {
    consumerTransport.close()
    producerTransport.close()
    socket.off('disconnect')
    socket.off('newUsers')
    socket.off('newMassage')
    socket.off('newPoll')
    socket.off('newHandUp')
    socket.off('newProducers')
    socket.off('consumerClosed')
    socket.off('userLeft')
  }

  if (!offline) {
    request('exitRoom', {}, socket)
      .then((e) => console.log(e))
      .catch((e) => console.warn(e))
      .finally(function () {
        clean()
        callBack()
      })
  } else {
    clean()
  }
}

const createRoom = async function (room_id, socket) {
  await request(
    'createRoom',
    {
      room_id,
    },
    socket
  ).catch((err) => {
    console.log('Create room error:', err)
  })
}

export const joinRoom = async function ({
                                          userId,
                                          room_id,
                                          socket,
                                          setUserList,
                                          getUserById,
                                        }) {
  await createRoom(room_id, socket).then(async function () {
    await join(userId, room_id, socket, setUserList, getUserById)
  })
}

export const produce = async function (
  type,
  deviceId = null,
  socket,
  setStream
) {
  let mediaConstraints = {}
  let audio = false
  let screen = false
  let stream = {}
  switch (type) {
    case mediaType.audio:
      mediaConstraints = {
        audio: {
          deviceId,
        },
        video: false,
      }
      audio = true
      break
    case mediaType.video:
      mediaConstraints = {
        audio: false,
        video: {
          width: {
            min: 640,
            ideal: 1280,
          },
          height: {
            min: 480,
            ideal: 720,
          },
          deviceId,
        },
      }
      break
    case mediaType.screen:
      mediaConstraints = false
      screen = true
      break
    default:
      return
  }
  if (!device.canProduce('video') && !audio) {
    console.error('Cannot produce video')
    return
  }

  if (producerLabel.has(type)) {
    console.log('Producer already exists for this type ' + type)
    return
  }
  try {
    stream = screen
      ? await navigator.mediaDevices.getDisplayMedia()
      : await navigator.mediaDevices.getUserMedia(mediaConstraints)

    const track = audio
      ? stream.getAudioTracks()[0]
      : stream.getVideoTracks()[0]
    const params = {
      track,
      appData: {
        isScreenShare: screen,
      },
    }
    if (!audio && !screen) {
      params.encodings = [
        {
          rid: 'r0',
          maxBitrate: 100000,
          //scaleResolutionDownBy: 10.0,
          scalabilityMode: 'S1T3',
        },
        {
          rid: 'r1',
          maxBitrate: 300000,
          scalabilityMode: 'S1T3',
        },
        {
          rid: 'r2',
          maxBitrate: 900000,
          scalabilityMode: 'S1T3',
        },
      ]
      params.codecOptions = {
        videoGoogleStartBitrate: 1000,
      }
    }

    producer = await producerTransport.produce(params)

    producers.set(producer.id, producer)

    let elem

    setStream(stream)
    producer.on('trackended', () => {
      closeProducer(type, socket)
    })

    producer.on('transportclose', () => {
      console.log('Producer transport close')
      if (!audio) {
        elem.srcObject.getTracks().forEach(function (track) {
          track.stop()
        })
        elem.parentNode.removeChild(elem)
      }
      producers.delete(producer.id)
    })

    producer.on('close', () => {
      console.log('Closing producer')
      if (!audio) {
        elem.srcObject.getTracks().forEach(function (track) {
          track.stop()
        })
        elem.parentNode.removeChild(elem)
      }
      producers.delete(producer.id)
    })

    producerLabel.set(type, producer.id)
  } catch (err) {
    console.log('Produce error:', err)
  }
}
export const closeProducer = function (type, socket, callback) {
  if (!producerLabel.has(type)) {
    console.log('There is no producer for this type ' + type)
    return
  }
  let producer_id = producerLabel.get(type)
  if (producers.has(producer_id)) {
    socket &&
    socket.emit('producerClosed', {
      producer_id,
    })
    producers.get(producer_id).close()
    producers.delete(producer_id)
  }
  producerLabel.delete(type)

  callback((stream) => {
    stream && stream.getTracks().forEach((track) => track.stop())
  })
}

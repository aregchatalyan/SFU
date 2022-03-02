const mediaConstraints = {
  video: {
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
    },
  },
  audio: {
    audio: true,
  },
  all: {
    audio: true,
    video: {
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 576, ideal: 720, max: 1080 },
    },
  },
}

export const getStream = (mediaType) => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia

  return new Promise((resolve, reject) => {
    navigator.getUserMedia(
      mediaConstraints[mediaType],
      (stream) => resolve(stream),
      (err) => reject(err)
    )
  })
}

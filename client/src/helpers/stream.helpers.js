const mediaConstraints = {
  video: {
    audio: false,
    video: {
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
    },
  },

  audio: {
    audio: true,
  },

  all: {
    audio: true,
    video: {
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
    },
  },
}

export const getStream = async (mediaType) => {
  return await navigator.mediaDevices.getUserMedia(mediaConstraints[mediaType])
}

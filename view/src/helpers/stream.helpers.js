const mediaConstraints = {
  video: {
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
    },
  },
  audio: {
    audio: true,
  },
};

export const getStream = (mediaType) => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  return new Promise((resolve, reject) => {
    navigator.getUserMedia(
      mediaConstraints[mediaType],
      (stream) => resolve(stream),
      (err) => reject(err)
    );
  });
};

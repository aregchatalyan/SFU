const DEFAULT_CONSTRAINTS = Object.freeze({
  audio: true,
  video: {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
  }
});

// Gets the users camera and returns the media stream
const GUM = () => navigator.mediaDevices.getUserMedia(DEFAULT_CONSTRAINTS);

export default GUM;
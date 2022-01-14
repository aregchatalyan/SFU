import { useState, useEffect } from "react";

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

export const getNavigationPermission = (mediaType) => {
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

export const useNavigationPermission = () => {
  const [videoPermission, setVideoPermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);

  const getPermission = (mediaType, callBack) => {
    navigator.permissions
      .query({ name: mediaType })
      .then((permissionStatus) => {
        if (
          permissionStatus.state === "granted" ||
          permissionStatus.state === "prompt"
        ) {
          callBack(true);
        } else if (permissionStatus.state === "denied") {
          callBack(false);
        }
        permissionStatus.onchange = ({ target: { state } }) => {
          if (state === "granted" || state === "prompt") {
            callBack(true);
          } else if (state === "denied") {
            callBack(false);
          }
        };
      });
  };

  useEffect(() => {
    getPermission("microphone", setAudioPermission);
    getPermission("camera", setVideoPermission);
  }, []);
  return { videoPermission, audioPermission };
};

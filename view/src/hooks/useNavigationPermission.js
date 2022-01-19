import { useState, useEffect } from "react";

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

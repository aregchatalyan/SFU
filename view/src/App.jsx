import "./App.css";
import React, { createContext, useEffect } from "react";
import io from "socket.io-client";
import Video from "./components/Video";
import { URL } from "./config";
import { UserInfoContext } from "./Context/userInfoContext";
import Waiting from "./components/Waiting";
import Spinner from "./components/Spinner";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { closeProducer, exit, joinRoom, produce } from "./services";
import useProducerChange, { useWindowDimensions } from "./hooks";

export const DimensionsContext = createContext({ width: 0, height: 0 });

function App() {
  const { userId } = useParams();
  const [roomId] = useState(1);
  const [users, setUsers] = useState([]);
  const size = useWindowDimensions();
  const [socket, setSocket] = useState();
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [videoPlayer, setVideoPlayer] = useState(false);
  const [stream, setStream] = useState();
  const [screenShare, setScreenShare] = useState(false);
  const [screenStream, setScreenStream] = useState();
  const [massages, setMassages] = useState([]);

  // minchev stex sax toshni e
  const [microphone, setMicrophone] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);
  const [videoPermission, setVideoPermission] = useState(true);
  const [audioPermission, setAudioPermission] = useState(true);

  const { setUserList, setProducers } = useProducerChange(socket, setUsers);
  //minchev stex xnamqi kariq ka
  const [lessonInfo, setLessonInfo] = useState(null);

  // hmi methodner@

  const confirmMiting = (stream, err) => {
    setLoading(true);
    joinRoom(
      userId,
      "R_123",
      socket,
      setUserList,
      setProducers,
      setMassages
    ).then(() => {
      setLoading(false);
      setIsReady(true);
      setStream(undefined);
      if (videoPlayer) {
        produce("videoType", null, socket, setStream);
      }
    });
  };
  const leaveMeeting = () => {
    exit(false, socket, () => {
      setIsReady(false);
      setStream(undefined);
      if (videoPlayer) {
        closeProducer("videoType", socket, setStream);
      }
    });
  };

  const shareScreen = () => {
    if (screenShare) {
      closeProducer("screenType", socket, setScreenStream);
    } else {
      produce("screenType", null, socket, setScreenStream);
    }
    setScreenShare(!screenShare);
  };

  const handleVideoClick = () => {
    if (!videoPlayer) {
      produce("videoType", null, socket, setStream);
    } else {
      closeProducer("videoType", socket, setStream);
    }
    setVideoPlayer(!videoPlayer);
  };
  // chotki ashxdox metodner

  const windowFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch((e) => {});
    }
  };
  // xnamqi kariq unecoxner

  useEffect(() => {
    const socket = io(URL);
    setSocket(socket);
    document.addEventListener("fullscreenchange", changeWidth);
    navigator.permissions
      .query({ name: "camera" })
      .then(function (permissionStatus) {
        permissionStatus.onchange = function () {
          if (this.state == "granted" || this.state == "prompt") {
            setVideoPermission(true);
            setAudioPermission(true);
          }
          if (this.state == "denied") {
            setVideoPlayer(false);
            setMicrophone(false);
            setVideoPermission(false);
            setAudioPermission(false);
          }
        };
      });
    return document.removeEventListener("fullscreenchange", changeWidth);
  }, []);

  const controlers = (type, value) => {
    if (type === "video") {
      setVideoPlayer(value);
    }
    if (type === "mic") {
      setMicrophone(value);
    }
  };

  const stopAudioOnly = () => {
    setMicrophone(!microphone);
    users[0].audio = !microphone;
    users[0].videoStream.getTracks()[0].enabled = !microphone;
    setUsers(users);
  };

  const changeWidth = () => {
    if (window.innerHeight === window.screen.height) {
      setFullScreen(false);
    } else {
      setFullScreen(true);
    }
  };

  const changeVideoPermission = () => {
    setVideoPermission(false);
  };

  const changeAudioPermission = () => {
    setAudioPermission(false);
  };
  return (
    <UserInfoContext.Provider value={{ users }}>
      <DimensionsContext.Provider value={size}>
        {!isReady ? (
          <Waiting
            handleConfirm={confirmMiting}
            handleControlers={controlers}
            handleVideoPermission={changeVideoPermission}
            handleAudioPermission={changeAudioPermission}
            videoPermission={videoPermission}
            audioPermission={audioPermission}
            lessonInfo={lessonInfo}
            error={false}
          />
        ) : (
          <Video
            microphone={microphone}
            handleSharing={shareScreen}
            handleFullScreen={windowFullScreen}
            handleStopAudioOnly={stopAudioOnly}
            socket={socket}
            {...{
              userId,
              fullScreen,
              videoPlayer,
              roomId,
              stream,
              screenStream,
              massages,
              handleVideoClick,
              leaveMeeting,
            }}
          />
        )}
        {loading ? <Spinner videoLoading={false} /> : null}
      </DimensionsContext.Provider>
    </UserInfoContext.Provider>
  );
}

export default App;

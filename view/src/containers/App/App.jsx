import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserInfoContext, DimensionsContext } from "../../Context";
import { useWindowDimensions, useProducerChange } from "../../hooks";
import { URL } from "../../config";
import io from "socket.io-client";
import { closeProducer, exit, joinRoom, produce } from "../../services";
import Waiting from "../../components/waiting";
import Spinner from "../../components/core/Spinner";
import VideoCall from "../../components/pages/VideoCall";
import { useNavigationPermission } from "../../hooks";

const App = () => {
  // params

  const { userId } = useParams();

  // hooks
  const size = useWindowDimensions();
  const { videoPermission, audioPermission } = useNavigationPermission();

  // state

  const [roomId] = useState(1);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState();
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [videoPlayer, setVideoPlayer] = useState(false);
  const [stream, setStream] = useState();
  const [screenShare, setScreenShare] = useState(false);
  const [screenStream, setScreenStream] = useState();
  const [massages, setMassages] = useState([]);
  const [polls, setPolls] = useState([]);
  const [hands, setHands] = useState([]);

  // minchev stex sax toshni e
  const [microphone, setMicrophone] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);

  console.log("PERMISSSION : ", videoPermission, audioPermission);

  const { setUserList, setProducers } = useProducerChange(socket, setUsers);
  //minchev stex xnamqi kariq ka
  const [lessonInfo, setLessonInfo] = useState(null);

  // hmi methodner@

  const confirmMiting = () => {
    console.log("OKOKOK");
    joinRoom(
      userId,
      "R_123",
      socket,
      setUserList,
      setProducers,
      setMassages,
      setPolls,
      setHands
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
      // getNavigationPermission("video")
      //   .then((stream) => {
      //     setStream(stream);
      //     produce("videoType", null, socket, setStream);
      //     setVideoPlayer(!videoPlayer);
      //   })
      //   .catch((err) => console.log("ERR : ", err));
    } else {
      closeProducer("videoType", socket, setStream);
      setVideoPlayer(!videoPlayer);
    }
  };
  // chotki ashxdox metodner
  const handleMicrophoneClick = () => {
    setMicrophone(!microphone);
  };

  const windowFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch((e) => {});
    }
  };
  // xnamqi kariq unecoxner

  useEffect(() => {
    const socket = io(URL, { secure: true });
    setSocket(socket);
    document.addEventListener("fullscreenchange", changeWidth);
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

  const changeWidth = () => {
    if (window.innerHeight === window.screen.height) {
      setFullScreen(false);
    } else {
      setFullScreen(true);
    }
  };

  return (
    <UserInfoContext.Provider value={{ users }}>
      <DimensionsContext.Provider value={size}>
        {!isReady ? (
          <Waiting
            handleConfirm={confirmMiting}
            handleControlers={controlers}
            lessonInfo={lessonInfo}
            error={false}
          />
        ) : (
          <VideoCall
            microphone={microphone}
            handleSharing={shareScreen}
            handleFullScreen={windowFullScreen}
            {...{
              userId,
              fullScreen,
              videoPlayer,
              handleVideoClick,
              handleMicrophoneClick,
              microphone,
              roomId,
              stream,
              screenStream,
              massages,
              leaveMeeting,
              hands,
              setHands,
              polls,
              socket,
            }}
          />
        )}
        {loading ? <Spinner videoLoading={false} /> : null}
      </DimensionsContext.Provider>
    </UserInfoContext.Provider>
  );
};

export default App;

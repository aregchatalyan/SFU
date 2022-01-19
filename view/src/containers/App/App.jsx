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
import Toast, { toastify } from "../../components/core/Toast";
import { firstPage } from "../../constant";
import { getStream } from "../../helpers";

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
  const [stream, setStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [screenShare, setScreenShare] = useState(false);
  const [screenStream, setScreenStream] = useState();
  const [massages, setMassages] = useState([]);
  const [polls, setPolls] = useState([]);
  const [hands, setHands] = useState([]);

  // minchev stex sax toshni e
  const [microphone, setMicrophone] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);

  const { setUserList, setProducers } = useProducerChange(socket, setUsers);

  // hmi methodner@

  const confirmMiting = () => {
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
        getStream("video").then((stream) => setStream(stream));
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
      if (videoPermission) {
        if (isReady) {
          produce("videoType", null, socket, setStream);
          setVideoPlayer(true);
        } else {
          getStream("video").then((stream) => {
            setStream(stream);
            setVideoPlayer(true);
          });
        }
      } else {
        toastify(firstPage.videoPermission);
      }
    } else {
      closeProducer("videoType", socket, setStream);
      setVideoPlayer(!videoPlayer);
    }
  };

  // chotki ashxdox metodner
  const handleMicrophoneClick = () => {
    if (!microphone) {
      if (audioPermission) {
        if (isReady) {
          produce("audioType", null, socket, setAudioStream);
          setMicrophone(true);
        } else {
          getStream("audio").then((stream) => {
            setAudioStream(stream);
            setMicrophone(true);
          });
        }
      } else {
        toastify(firstPage.voicePermission);
      }
    } else {
      closeProducer("audioType", socket, setAudioStream);
      setMicrophone(false);
    }
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

  useEffect(() => {
    if (videoPermission) {
      handleVideoClick();
    } else {
      setVideoPlayer(false);
      setStream(undefined);
    }
  }, [videoPermission]); // eslint-disable-line

  const changeWidth = () => {
    if (window.innerHeight === window.screen.height) {
      setFullScreen(false);
    } else {
      setFullScreen(true);
    }
  };

  return (
    <UserInfoContext.Provider value={{ users }}>
      <React.StrictMode>
        <DimensionsContext.Provider value={size}>
          {!isReady ? (
            <Waiting
              {...{
                stream,
                videoPlayer,
                handleVideoClick,
                microphone,
                handleMicrophoneClick,
                handleConfirm: confirmMiting,
                audioStream,
              }}
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
                audioStream,
              }}
            />
          )}
          {loading ? <Spinner videoLoading={false} /> : null}
        </DimensionsContext.Provider>
      </React.StrictMode>
      <Toast />
    </UserInfoContext.Provider>
  );
};

export default App;

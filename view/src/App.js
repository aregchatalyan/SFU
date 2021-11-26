import "./App.css";
import React, { useEffect } from "react";
import io from "socket.io-client";
import { Container, Row } from "react-bootstrap";
import Users from "./Components/Users";
import Video from "./Components/Video/video";
import axios from "axios";
import { URL } from "./config/config";
import { ToastContainer, toast } from "react-toastify";
import { firstPage } from "./constant";

import { UserInfoContext } from "./Context/userInfoContext";
import Waiting from "./Components/Waiting/";
import Spinner from "./Components/Spinner";

import { useState } from "react";
import { BrowserRouter, useParams } from "react-router-dom";
import { closeProducer, joinRoom, produce } from "./helpers/index";

function App() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [videoPlayer, setVideoPlayer] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [microphone, setMicrophone] = useState(true);
  const [data, setData] = useState([]);
  const [lesson_id] = useState(
    new URLSearchParams(window.location.search).get("lesson")
  );
  const [roomId] = useState(1);
  const [socket, setSocket] = useState();
  const [stream, setStream] = useState();
  const [newStream, setnewStream] = useState();
  const [screenStream, setScreenStream] = useState();
  const [selectedStream] = useState();
  const [selectedUserScreen, setSelectedUserScreen] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);
  const [type] = useState("video");
  const [screen, setScreen] = useState();
  const [showRightSection] = useState(true);
  const [users, setUsers] = useState([]);
  // const [userVideoStream] = useState(null);
  const [mobile] = useState(false);
  const [videoPermission, setVideoPermission] = useState(true);
  const [audioPermission, setAudioPermission] = useState(true);
  const [counter, setCounter] = useState(0);
  const [currentUser, setCurrentUser] = useState([]);
  const [lessonInfo, setLessonInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io("https://192.168.1.243:3030");
    setSocket(socket);
    document.addEventListener("fullscreenchange", () => {
      changeWidth();
    });
    // if(!JSON.parse(localStorage.getItem('user'))?.token){
    //   window.location.href =`${ process.env.NODE_ENV =='development' ? 'http://localhost:8082' : 'https://univern.org'}/login?next=`;
    // }
    // else{
    // axios
    //   .post(`${URL}/videocall/token`, {
    //     token: JSON.parse(localStorage.getItem("user"))?.token,
    //     lesson_id,
    //   })
    //   .then((res) => {
    //     const { duration, time } = res.data.info;
    //     setCurrentUser(res.data.user);
    //     setLessonInfo(res.data.info);
    //     if (duration * 60 * 1000 - (Date.now() - time * 1000) <= 0) {
    //       setError("Դասը ավարտվել է");
    //     } else if (time * 1000 > Date.now()) {
    //       setError("Դասը դեռ չի սկսվել");
    //     } else {
    //       setError(false);
    //     }
    //   })
    //   .catch((err) => {
    //     setError(false);
    //     // window.location.href =`${ process.env.NODE_ENV =='development' ? 'http://localhost:8082' : 'https://univern.org'}/login?next=`;
    //   });
    // // }
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
  }, []);

  const userListAction = () => {
    setUserList(!userList);
  };

  const confirmMiting = (stream, err) => {
    setLoading(true);
    joinRoom(userId, "R_123", socket, setUsers).then(() => {
      setLoading(false);
      setIsReady(true);
      setStream(undefined);
      // produce("videoType", null, socket, setStream);
    });
    // if (!isReady) {
    //   axios
    //     .get(`${URL}/videocall`)
    //     .then((res) => {
    //       setStream(stream);
    //       setLoading(false);
    //       setIsReady(true);
    //     })
    //     .catch((err) => {
    //       if (err) {
    //         toast.error(firstPage.connectionFaild, {
    //           position: "bottom-left",
    //           autoClose: 7000,
    //           hideProgressBar: true,
    //           closeOnClick: true,
    //           pauseOnHover: true,
    //           draggable: false,
    //           progress: undefined,
    //         });
    //         setLoading(false);
    //       }
    //     });
    // } else {
    //   setStream("");
    //   socket.removeAllListeners();
    //   setIsReady(false);
    //   setLoading(false);
    //   setVideoPlayer(true);
    //   setMicrophone(true);
    // }
    // if (err) {
    //   toast.error(firstPage.connectionFaild, {
    //     position: "bottom-left",
    //     autoClose: 7000,
    //     hideProgressBar: true,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: false,
    //     progress: undefined,
    //   });
    // }
  };

  const controlers = (type, value) => {
    if (type === "video") {
      setVideoPlayer(value);
    }
    if (type === "mic") {
      setMicrophone(value);
    }
  };

  const shareScreen = () => {
    if (screenShare) {
      closeProducer("screenType", socket, setScreenStream);
    } else {
      produce("screenType", null, socket, setScreenStream);
    }
    setScreenShare(!screenShare);
  };

  const stopShareScreen = (stream) => {
    socket.emit("screen-sharing", {
      streamId: "",
      userId,
      type: "screen",
      value: false,
    });
    socket.emit("stop-screen", { userId, type: "screen" });
    setScreen(false);
  };
  const handleVideoClick = () => {
    if (!videoPlayer && videoPermission) {
      produce("videoType", null, socket, setStream);
    } else {
      closeProducer("videoType", socket, setUsers);
    }
    setVideoPlayer(!videoPlayer);
  };

  const windowFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch((e) => {});
    }
  };

  // const stopVideoOnly = (status) => {
  //   if (!status) {
  //     setVideoPlayer(true);
  //     if (counter > 2) return;

  //     setCounter((c) => c + 1);
  //     setTimeout(() => {
  //       setCounter((c) => c - 1);
  //     }, 5000);

  //     navigator.getUserMedia =
  //       navigator.getUserMedia ||
  //       navigator.webkitGetUserMedia ||
  //       navigator.mozGetUserMedia ||
  //       navigator.msGetUserMedia;
  //     navigator.getUserMedia(
  //       {
  //         video: {
  //           width: { min: 144, ideal: 1080, max: 2048 },
  //           height: { min: 144, ideal: 720, max: 1080 },
  //         },
  //         audio: audioPermission,
  //       },
  //       function (yourNewStream) {
  //         // if (!users[0].audio && audioPermission) {
  //         //   yourNewStream.getTracks()[0].enabled = false;
  //         // }
  //         setnewStream(yourNewStream);
  //         socket.emit("changeVideoStream", {
  //           userId,
  //           streamId: yourNewStream.id,
  //           type: "created",
  //         });
  //         socket.emit("setTrack", {
  //           userId,
  //           type: "video",
  //           value: !videoPlayer,
  //           videoPermission,
  //           audioPermission,
  //         });
  //       },
  //       function (err) {
  //         setVideoPlayer(false);
  //         toast.error(`Միացրեք տեսախցիկի թույլտվությունները`, {
  //           position: "top-right",
  //           autoClose: 4000,
  //           hideProgressBar: true,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: false,
  //           progress: undefined,
  //         });
  //       }
  //     );
  //   } else {
  //     setVideoPlayer(false);
  //     users[0].videoStatus = false;
  //     users[0].videoStream.getVideoTracks().forEach((track) => {
  //       track.stop();
  //     });
  //     socket.emit("changeVideoStream", {
  //       userId,
  //       streamId: "",
  //       type: "deleted",
  //     });
  //     setUsers(users);
  //     socket.emit("setTrack", {
  //       userId,
  //       type: "video",
  //       value: !videoPlayer,
  //       videoPermission,
  //       audioPermission,
  //     });
  //   }
  // };

  const streamCreated = () => {
    setVideoPlayer(true);
  };

  const stopAudioOnly = () => {
    socket.emit("setTrack", {
      userId,
      type: "audio",
      value: !microphone,
      audioPermission,
    });
    setMicrophone(!microphone);
    users[0].audio = !microphone;
    users[0].videoStream.getTracks()[0].enabled = !microphone;
    setUsers(users);
  };

  const changeWidth = () => {
    if (window.innerHeight === window.screen.height) {
      setFullScreen(false);
      setUserList(false);
    } else {
      setFullScreen(true);
    }
  };

  const closeScreen = () => {
    setSelectedUserScreen(false);
  };

  const changeVideoPermission = () => {
    setVideoPermission(false);
  };

  const changeAudioPermission = () => {
    setAudioPermission(false);
  };

  useEffect(() => {
    const onbeforeunloadFn = () => {
      socket.emit("user_leaving");
    };

    window.addEventListener("beforeunload", onbeforeunloadFn);
    return () => {
      window.removeEventListener("beforeunload", onbeforeunloadFn);
    };
  }, [socket]);

  return (
    <UserInfoContext.Provider value={{ users, setUsers }}>
      {!isReady ? (
        <Waiting
          handleConfirm={confirmMiting}
          handleControlers={controlers}
          handleVideoPermission={changeVideoPermission}
          handleAudioPermission={changeAudioPermission}
          videoPermission={videoPermission}
          audioPermission={audioPermission}
          currentUser={currentUser}
          lessonInfo={lessonInfo}
          error={false}
        />
      ) : (
        <>
          <Container fluid={true}>
            <Row>
              <div
                className="px-0"
                style={{
                  width: `${userList ? "16.68%" : "0%"}`,
                  transition: ".3s",
                }}
              >
                <div style={{ display: `${userList ? "block" : "none"}` }}>
                  <h6 className="text-center my-0 py-3">Մասնակիցներ</h6>
                  <hr className="my-0 pb-3" />
                  {userList ? (
                    <Users
                      handleShow={userListAction}
                      socket={socket}
                      roomId={roomId}
                      stream={stream}
                      screenStream={screenStream}
                      fullScreen={fullScreen}
                      type={type}
                      screen={screen}
                      audio={microphone}
                      video={stream?.id ? stream.id : ""}
                      videoStatus={videoPlayer}
                      currentUser={currentUser}
                    />
                  ) : null}
                </div>
              </div>
              <div
                className="pr-0 position-absolute"
                style={{
                  width: `${
                    userList
                      ? "83.32%"
                      : mobile
                      ? "99.9%"
                      : !userList && fullScreen
                      ? "100%"
                      : !fullScreen
                      ? "99.94%"
                      : "83%"
                  }`,
                  right: fullScreen ? 0 : "1px",
                  transition: ".6s",
                }}
              >
                <Video
                  style={{ height: window.innerHeight }}
                  userId={userId}
                  fullScreen={fullScreen}
                  microphone={microphone}
                  videoPlayer={videoPlayer}
                  handleSharing={shareScreen}
                  handleFullScreen={windowFullScreen}
                  handleStopAudioOnly={stopAudioOnly}
                  handleVideoClick={handleVideoClick}
                  // handleStopVideoOnly={stopVideoOnly}
                  handleUserListAction={userListAction}
                  leaveMiting={confirmMiting}
                  userStream={selectedStream}
                  socket={socket}
                  handleShow={userListAction}
                  roomId={roomId}
                  stream={stream}
                  screenStream={screenStream}
                  type={type}
                  screen={screen}
                  audio={microphone}
                  video={stream?.id ? stream.id : ""}
                  videoStatus={videoPlayer}
                  userList={userList}
                  showRightSection={showRightSection}
                  selectedUserScreen={selectedUserScreen}
                  // userVideoStream={userVideoStream}
                  hadnleCloseScreen={closeScreen}
                  streamCreated={streamCreated}
                  mobile={mobile}
                  videoPermission={videoPermission}
                  audioPermission={audioPermission}
                  newStream={newStream}
                  counter={counter}
                  userList={userList}
                  currentUser={currentUser}
                  lessonInfo={lessonInfo}
                  data={data}
                />
              </div>
            </Row>
          </Container>
        </>
      )}
      {loading ? <Spinner videoLoading={false} /> : null}
    </UserInfoContext.Provider>
  );
}

export default App;

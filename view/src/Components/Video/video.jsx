import React, { useState, useRef, useContext, useEffect, memo } from "react";
import classes from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MainMenu } from "./MainMenu/MainMenu";
import {
  faVideo,
  faBell,
  faTimes,
  faMicrophoneAltSlash,
  faExpand,
  faTh,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Draggable from "react-draggable";
import AudioAnalyser from "../AudioAnalyser";
import QuestionModal from "./questionModal";
import Board from "../Board";
import { UserInfoContext } from "../../Context/userInfoContext";
import { toast } from "react-toastify";
import Chat from "../Chat";
import Timer from "react-compound-timer";
import lastoflessonAudio from "./notification.mp3";
import { RightSideMenu } from "./RightSideMenu/RightSideMenu";
import { LeftSideMenu } from "./LeftSideMenu/LeftSideMenu";
import { Button } from "../Button";
import UserVideos from "../UsersVideoContainer";

const Video = (props) => {
  const {
    userId,
    type,
    roomId,
    currentUser,
    videoPlayer,
    audioPermission,
    handleStopAudioOnly,
    screenStream,
    fullScreen,
    handleFullScreen,
    hadnleCloseScreen,
    selectedUserScreen,
    counter,
    handleVideoClick,
    videoPermission,
    socket,
    handleSharing,
    handleStopSharing,
    leaveMiting,
    streamCreated,
    handleShow,
    audio,
    mobile,
  } = props;
  console.log("SCREEN  CHKA", screenStream);
  const [id] = useState(currentUser.id);
  const [video, setVideoPlayer] = useState(videoPlayer);
  const [microphone, setMicrophone] = useState(props.microphone);
  const [ShowControls] = useState(true);
  const [index, setIndex] = useState(null);
  const userVideo = useRef();
  const sharedUserVideo = useRef();
  const windowContainer = useRef();
  const [screen, setScreen] = useState(props.screen);
  const [myScreen, setMyscreen] = useState(false);
  const [stream, setStream] = useState();
  const [selectedStream, setSelectedStream] = useState(false);
  const [userSmallVideo, setUserSmallVieo] = useState(false);
  const [mySmallVideo, setMySmallVideo] = useState(false);
  const [smallVideoConttroller, setSmallVideoConttroller] = useState(false);
  const [myVideo, setMyVideo] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [notification, setNotification] = useState(false);
  const [questionNotification, setQuestionNotification] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [question, setQuestion] = useState(false);
  const [hand, setHand] = useState(false);
  const [sendedQuestions, setSendedQuestions] = useState([]);
  const [endOfLesson, setEndOfLesson] = useState(false);
  const [board, setBoard] = useState(false);
  const { users, setUsers } = useContext(UserInfoContext);

  const handleMsgClick = () => {
    setShowChat(!showChat);
    setNotification(false);
  };
  const handleMicrophoneClick = () => {
    handleStopAudioOnly();
    if (!audioPermission) {
      setMicrophone(false);
    } else {
      setMicrophone(!microphone);
    }
  };
  // const handleVideoClick = () => {
  //   //handleStopVideoOnly(video);
  //   // if(!users[0].videoStream){
  //   //     setVideoPlayer(false);
  //   // }
  //   // else if(users[0].videoStream && videoPermission){
  //   //     setVideoPlayer(!video);
  //   // }
  //   counter < 2 && videoPermission && setVideoPlayer(!video);
  //   counter >= 2 && videoPermission && setVideoPlayer(false);
  //   !videoPermission && setVideoPlayer(false);
  // };

  useEffect(() => {
    if (!videoPermission) {
      setVideoPlayer(false);
      socket.emit("setTrack", {
        userId,
        type: "video",
        value: false,
        videoPermission: false,
      });
    }
    if (!audioPermission) {
      setMicrophone(false);
      socket.emit("setTrack", {
        userId,
        type: "audio",
        value: false,
        audioPermission: false,
      });
    }
  }, [videoPermission, audioPermission]);

  useEffect(() => {
    socket.on("hand-down", (data) => {
      console.log("dzers ijcrin", data);
      setHand(false);
    });
  }, []);

  useEffect(() => {
    socket.on("getQuestions", (data) => {
      console.log("getQuestions----------", data);
      data.checked = false;
      data.status = true;
      addQuestion(data);
      getAllPercentageCalc(data);
    });
    socket.on("pendingSurvey", (data) => {
      console.log("pendingSurvey----------", data);
      data.status = false;
      addQuestion(data);
    });
    socket.on("sendedSurvey", (data) => {
      console.log("sendedSurvey----------", data);
      data.checked = false;
      data.status = true;
      addQuestion(data);
    });
    socket.on("rejectSurveySend", (data) => {
      console.log("sendedSurvey----------", data);
      toast.error(`Ձեր հարցումը մերժվեց`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    });
  }, []);

  useEffect(() => {
    socket.on("votesCountSend", (data) => {
      console.log("votesCountSend", data);
      percentageCalc(data);
    });
  }, []);

  // const shareScreen = () => {
  //   if (!myScreen) {
  //     navigator.mediaDevices
  //       .getDisplayMedia({ cursor: true })
  //       .then((stream) => {
  //         if (userVideo.current) {
  //           userVideo.current.srcObject = stream;
  //           handleSharing(stream);
  //           setSelectedStream(stream);
  //           setMyscreen(true);
  //           setStream(stream);
  //           setMySmallVideo(true);
  //           setIndex(null);
  //           setMyVideo(false);
  //         }
  //         stream.getVideoTracks()[0].onended = function () {
  //           console.log("-------------------------------", stream);
  //           handleStopSharing(stream);
  //           stream.getVideoTracks()[0].stop();
  //           setMyscreen(false);
  //         };
  //       })
  //       .catch(() => {});
  //   } else {
  //     handleStopSharing(stream);
  //     stream.getVideoTracks()[0].stop();
  //     setMyscreen(false);
  //     setSelectedStream(false);
  //     setMySmallVideo(true);
  //     setIndex(null);
  //   }
  // };

  const showSelectedUser = (stream, status, id, myVideo) => {
    console.log("showSelectedUser", stream);
    if (users.length <= 1) {
      return;
    } else {
      console.log(id, myVideo, status);
      var userIndex = users.findIndex((user) => +user.id === +id);
      setSelectedUserId(id);
      setScreen(status);
      console.log(userIndex, users);
      if (users[userIndex].videoStatus && users[userIndex].screen) {
        setUserSmallVieo(true);
        if (sharedUserVideo.current) {
          sharedUserVideo.current.srcObject = users[userIndex].videoStream;
        }
      } else if (
        !myVideo &&
        !users[userIndex].videoStatus &&
        users[userIndex].screen &&
        users[0].videoStatus
      ) {
        setMySmallVideo(true);
        if (sharedUserVideo.current && users[0].videoStatus) {
          sharedUserVideo.current.srcObject = users[0].videoStream;
        }
      } else if (!myVideo && users[0].videoStatus && !users[userIndex].screen) {
        setMySmallVideo(true);
        if (sharedUserVideo.current && users[0].videoStatus) {
          sharedUserVideo.current.srcObject = users[0].videoStream;
        }
      }
      console.log("userIndex", userIndex);
      setIndex(userIndex);
      console.log("-----------", status, users[userIndex].screen);
      setSelectedStream(stream);
      if (users[userIndex].screen) {
        setMyVideo(false);
        console.log(
          "---------users[userIndex].screen",
          users[userIndex].screen
        );
      } else {
        console.log("es meky", users[userIndex].screen);
        setMyVideo(myVideo);
      }
      console.log(stream);
      userVideo.current.srcObject = stream;
    }
  };

  const showUserScreen = (stream, userVideoStream, videoStatus) => {
    console.log("video sttsus ------------", videoStatus);
    setIndex(null);
    setMyVideo(false);
    if (videoStatus) {
      setUserSmallVieo(true);
    } else {
      setUserSmallVieo(false);
    }
    setSelectedStream(stream);
    setScreen(true);
    console.log(stream);
    if (userVideo.current) {
      userVideo.current.srcObject = stream;
    }
    if (sharedUserVideo.current && videoStatus) {
      sharedUserVideo.current.srcObject = userVideoStream;
    }
  };

  const closeScreenInLeave = () => {
    stream.getVideoTracks()[0].stop();
  };

  const leaveMeeting = () => {
    socket.emit("user_leaving");
    setUsers([]);
    if (myScreen) {
      closeScreenInLeave();
    }
    leaveMiting();
  };

  const stopScreenShare = () => {
    setScreen(false);
    setSelectedStream(false);
    setUserSmallVieo(false);
    setIndex(null);
  };

  const showYourVideo = (stream, videoStatus) => {
    if (videoStatus) {
      setUserSmallVieo(true);
      sharedUserVideo.current.srcObject = stream;
      setIndex(null);
    } else {
      setUserSmallVieo(false);
    }
  };

  const toggleSmallVideo = (value) => {
    if (!selectedStream) {
      setUserSmallVieo(false);
    } else {
      setUserSmallVieo(value);
      if (!value) {
        setSmallVideoConttroller(false);
      }
    }
  };

  const createdVideoStream = () => {
    setVideoPlayer(true);
    streamCreated();
  };

  const messageNotification = () => {
    setNotification(true);
  };

  const changeSmallVideo = (video, userIndex) => {
    console.log("-------hesa", video, userIndex);
    if (video) {
      if (sharedUserVideo.current) {
        sharedUserVideo.current.srcObject = users[userIndex].videoStream;
      }
    } else {
      console.log("poxec im video");
      setMySmallVideo(true);
      if (sharedUserVideo.current) {
        sharedUserVideo.current.srcObject = users[0].videoStream;
      }
    }
  };

  const questionToggle = () => {
    setQuestion(!question);
  };

  const handUp = () => {
    setHand(!hand);
    socket.emit("hand-up", { userId: id, value: !hand });
  };

  const addQuestion = (data) => {
    setSendedQuestions((prevValue) => {
      return [data, ...prevValue];
    });
    setQuestionNotification(() => {
      return true;
    });
  };

  const getAllPercentageCalc = (datas) => {
    let labels = [];
    let data = [];
    let choicesCount = 0;
    console.log("percentageCalc----", datas);
    for (let i = 0; i < datas.choices.length; i++) {
      labels.push(
        `${+datas.choices[i].id + 1}. - ${datas.choices[i].voters.length} Ձայն`
      );
      choicesCount += datas.choices[i].voters.length;
    }
    for (let i = 0; i < datas.choices.length; i++) {
      let value = (datas.choices[i].voters.length / choicesCount) * 100;
      console.log(value);
      data.push(Math.round(value));
    }
    console.log("labels", labels);
    console.log("choicesCount", choicesCount);
    console.log("data", data);

    setSendedQuestions((prevValue) => {
      console.log("prevValue", prevValue);
      let newSendedQuestions = [...prevValue];
      let index = prevValue.findIndex(
        (sendedQuestion) => sendedQuestion.questionId == datas.questionId
      );
      newSendedQuestions[index].chartData = {
        labels,
        datasets: [
          {
            label: "choice %",
            data,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
            ],
          },
        ],
      };
      console.log("index----------", index);
      return newSendedQuestions;
    });
  };

  const seeQuestion = () => {
    setQuestionNotification(false);
  };

  const questionChecked = (id) => {
    let newSendedQuestions = [...sendedQuestions];
    console.log("questionChecked", sendedQuestions);
    let index = newSendedQuestions.findIndex(
      (sendedQuestion) => sendedQuestion.questionId == id
    );
    console.log("questionCheckedIndex", index);
    if (index >= 0) {
      newSendedQuestions[index].checked = true;
      setSendedQuestions(newSendedQuestions);
    }
  };

  const clearQuestion = (data) => {
    let newSendedQuestion = [...sendedQuestions];
    let index = sendedQuestions.findIndex((sendedQuestion) => {
      if (!sendedQuestion?.questionId) {
        return sendedQuestion.question == data.question;
      }
    });
    newSendedQuestion.splice(index, 1);
    setSendedQuestions(newSendedQuestion);
    console.log("clearQuestion", index, data);
  };

  const percentageCalc = (datas) => {
    let labels = [];
    let data = [];
    let choicesCount = 0;
    console.log("percentageCalc----", datas);
    for (let i = 0; i < datas.context.length; i++) {
      labels.push(
        `${+datas.context[i].id + 1}. - ${datas.context[i].voters.length} Ձայն`
      );
      choicesCount += datas.context[i].voters.length;
    }
    for (let i = 0; i < datas.context.length; i++) {
      let value = (datas.context[i].voters.length / choicesCount) * 100;
      console.log(value);
      data.push(Math.round(value));
    }
    // console.log('labels', labels);
    // console.log('choicesCount', choicesCount);
    // console.log('data', data);

    setSendedQuestions((prevValue) => {
      console.log("prevValue", prevValue);
      let newSendedQuestions = [...prevValue];
      let index = prevValue.findIndex(
        (sendedQuestion) => sendedQuestion.questionId == datas.questionId
      );
      newSendedQuestions[index].chartData = {
        labels,
        datasets: [
          {
            label: "choice %",
            data,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
            ],
          },
        ],
      };
      console.log("index----------", index);
      return newSendedQuestions;
    });
  };

  const getTime = (duration, lessonDay) => {
    if (duration * 60 * 1000 - (Date.now() - lessonDay * 1000) <= 0) {
      return 0;
    }
    return duration * 60 * 1000 - (Date.now() - lessonDay * 1000);
  };

  return (
    <>
      <div
        ref={windowContainer}
        className={classes.videoContainer}
        id="handleWidow"
        style={{ height: "100vh" }}
      >
        <video
          ref={userVideo}
          autoPlay
          muted={true}
          style={{
            objectFit: `${screen || myScreen ? "revert" : "cover"}`,
            display: `${
              selectedStream && !myScreen && !board ? "block" : "none"
            }`,
            transform: `${!myVideo ? "" : "scaleX(-1)"}`,
            height: "100%",
          }}
          className={`${classes.headWindow}`}
          id="headVideo"
        />
        {selectedStream && index && users[index].audio ? (
          <div className={classes.vizualiser}>
            <AudioAnalyser audio={users[index].videoStream} />
          </div>
        ) : null}
        {myScreen && selectedStream ? (
          <div className={classes.screenNotification}>
            Դուք ցուցադրում եք ձեր էկրանը
          </div>
        ) : null}
        {selectedStream && index && !users[index].audio ? (
          <FontAwesomeIcon
            className={`${classes.muteMicrophone}`}
            icon={faMicrophoneAltSlash}
          />
        ) : null}
        {board ? <Board socket={socket} setBoard={setBoard} /> : null}
        <div
          className={`${classes.lessonNotification} ${
            endOfLesson ? classes.lessonLastTime : ""
          }`}
        >
          <FontAwesomeIcon icon={faBell} />
          {endOfLesson ? <audio src={lastoflessonAudio} loop autoPlay /> : null}
        </div>
        <FontAwesomeIcon
          icon={faExpand}
          className={classes.fullScreen}
          style={{
            display: `${selectedStream && mobile ? "block" : "none"}`,
            top: `${selectedStream && mobile ? "39%" : ""}`,
          }}
          onClick={handleFullScreen}
        />
        <FontAwesomeIcon
          icon={faArrowLeft}
          className={classes.backtovideosMobile}
          style={{ display: `${selectedStream && mobile ? "block" : "none"}` }}
          onClick={() => {
            setSelectedStream(false);
            setScreen(false);
            setIndex(null);
            setUserSmallVieo(false);
            setSmallVideoConttroller(false);
            if (selectedUserScreen) {
              hadnleCloseScreen();
            }
          }}
        />
        {index !== null && !users[index].videoStatus && !users[index].screen ? (
          <div className={classes.userImage}>
            <div className="userImg" />
            <h3 className="text-white"> {users[index].name} Poxosyan </h3>
          </div>
        ) : null}

        {
          <Draggable
            handle=".handle"
            defaultPosition={{ x: 0, y: 0 }}
            position={null}
            grid={[1, 1]}
            scale={1}
            bounds={
              windowContainer.current && {
                bottom:
                  windowContainer.current.getBoundingClientRect().height -
                    150 || 0,
                left:
                  -windowContainer.current.getBoundingClientRect().width +
                    210 || 0,
                top: 0,
                right: 0,
              }
            }
          >
            <div
              className={`${classes.userSmallVideo} handle`}
              style={{
                display: `${
                  userSmallVideo || (mySmallVideo && video) ? "block" : "none"
                }`,
              }}
            >
              <video ref={sharedUserVideo} autoPlay muted={true} />
              <FontAwesomeIcon
                icon={faTimes}
                className={`${classes.closVideo}`}
                onClick={() => {
                  setUserSmallVieo(false);
                  setSmallVideoConttroller(true);
                  setMySmallVideo(false);
                }}
              />
            </div>
          </Draggable>
        }
        {
          <UserVideos
            users={users}
            selfId={userId}
            selfStream={props.stream}
            selfScreenStream={screenStream}
          />
        }
        <Button
          type="fullScreen"
          method={handleFullScreen}
          condition={fullScreen}
        />
        <div className="">
          <div
            className={`${classes.controlers}`}
            style={{
              position: "absolute",
              marginTop: mobile ? "13px" : "",
            }}
          >
            <LeftSideMenu showUser={props.handleUserListAction} />
            <MainMenu
              microphone={microphone}
              microphoneClick={handleMicrophoneClick}
              video={video}
              videoClick={handleVideoClick}
              notification={ShowControls && notification && !showChat}
              msgClick={handleMsgClick}
              shareScreen={handleSharing}
              leaveMeeting={leaveMeeting}
            />
            <RightSideMenu
              board={board}
              openBoard={() => {
                setBoard(!board);
              }}
              request={question}
              openRequest={questionToggle}
              hand={hand}
              handUp={handUp}
            />
          </div>

          <FontAwesomeIcon
            icon={faTh}
            className={classes.backtovideos}
            style={{
              display: `${
                ShowControls && selectedStream && !mobile ? "block" : "none"
              }`,
            }}
            onClick={() => {
              setSelectedStream(false);
              setScreen(false);
              setIndex(null);
              setUserSmallVieo(false);
              setSmallVideoConttroller(false);
              if (selectedUserScreen) {
                hadnleCloseScreen();
              }
            }}
          />
          <FontAwesomeIcon
            icon={faVideo}
            className={classes.smallVideoController}
            style={{ display: `${smallVideoConttroller ? "block" : "none"}` }}
            onClick={() => {
              setUserSmallVieo(true);
              setSmallVideoConttroller(false);
            }}
          />
        </div>
        {showChat ? (
          <Chat
            socket={socket}
            showChat={showChat}
            messageNotification={messageNotification}
            mobile={props.mobile}
            currentUser={currentUser}
          />
        ) : null}

        {question ? (
          <QuestionModal
            onCancel={questionToggle}
            socket={socket}
            sendedQuestions={sendedQuestions}
            notification={questionNotification}
            seeQuestion={seeQuestion}
            questionChecked={questionChecked}
            clearQuestion={clearQuestion}
            currentUser={currentUser}
          />
        ) : null}
      </div>
    </>
  );
};

export default memo(Video);

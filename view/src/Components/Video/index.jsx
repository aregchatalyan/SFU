import React, { useState, useContext, memo, useRef } from "react";
import Board from "../Board";
import { UserInfoContext } from "../../Context/userInfoContext";
import { Button } from "../Button";
import UserVideos from "../UsersVideoContainer";
import UserList from "../UserList";
import style from "./style.module.scss";
import { DimensionsContext } from "../../App";
import MenuBar from "./MenuBar";
import LessonLog from "../LessonLog";
import { useOutsideClick } from "./hook";

const isTeacher = false;

const Video = (props) => {
  const {
    userId,
    videoPlayer,
    screenStream,
    audioPermission,
    handleStopAudioOnly,
    fullScreen,
    handleFullScreen,
    handleVideoClick,
    socket,
    handleSharing,
    leaveMeeting,
  } = props;
  const [id] = useState("");
  const { width, height } = useContext(DimensionsContext);
  const [isUserListOpened, setIsUserListOpened] = useState(false);
  const [isChateOpened, setIsChateOpened] = useState();
  const [isBoardOpened, setIsBoardOpened] = useState(false);
  const logRef = useRef(null);
  const wrapperRef = useRef(null);
  const { active: isLogOpened, setActive: setIsLogOpened } = useOutsideClick(
    logRef,
    wrapperRef
  );
  const [microphone, setMicrophone] = useState(props.microphone);
  const [notification, setNotification] = useState(false);
  const [questionNotification, setQuestionNotification] = useState(false);
  const [question, setQuestion] = useState(false);
  const [hand, setHand] = useState(false);
  const [sendedQuestions, setSendedQuestions] = useState([]);
  const { users } = useContext(UserInfoContext);

  const showUser = () => {
    setIsUserListOpened(!isUserListOpened);
    setIsChateOpened(false);
  };
  const showChat = () => {
    setIsChateOpened(!isChateOpened);
  };

  const handleMicrophoneClick = () => {
    handleStopAudioOnly();
    if (!audioPermission) {
      setMicrophone(false);
    } else {
      setMicrophone(!microphone);
    }
  };

  const questionToggle = () => {
    setQuestion(!question);
  };

  const handUp = () => {
    setHand(!hand);
    socket.emit("hand-up", { userId: id, value: !hand });
  };

  const goToVideoCall = () => {
    setIsBoardOpened(false);
    setIsLogOpened(false);
  };

  // const seeQuestion = () => {
  //   setQuestionNotification(false);
  // };

  // const questionChecked = (id) => {
  //   let newSendedQuestions = [...sendedQuestions];
  //   console.log("questionChecked", sendedQuestions);
  //   let index = newSendedQuestions.findIndex(
  //     (sendedQuestion) => sendedQuestion.questionId == id
  //   );
  //   console.log("questionCheckedIndex", index);
  //   if (index >= 0) {
  //     newSendedQuestions[index].checked = true;
  //     setSendedQuestions(newSendedQuestions);
  //   }
  // };

  // const clearQuestion = (data) => {
  //   let newSendedQuestion = [...sendedQuestions];
  //   let index = sendedQuestions.findIndex((sendedQuestion) => {
  //     if (!sendedQuestion?.questionId) {
  //       return sendedQuestion.question == data.question;
  //     }
  //   });
  //   newSendedQuestion.splice(index, 1);
  //   setSendedQuestions(newSendedQuestion);
  //   console.log("clearQuestion", index, data);
  // };

  return (
    <div className={style.fullScreenWrapper} style={{ width, height }}>
      <UserList
        className={isUserListOpened ? style.userList : style.userListHide}
        {...{ showUser, selfId: userId, videoPlayer }}
      />
      <div
        className={
          isUserListOpened
            ? style.videoContainerMiddle
            : style.videoContainerFull
        }
      >
        <UserVideos
          style={{ width: width / 5 }}
          {...{
            users,
            selfId: userId,
            selfStream: props.stream,
            selfScreenStream: screenStream,
          }}
        />

        <MenuBar
          {...{
            showUser,
            microphone,
            handleMicrophoneClick,
            videoPlayer,
            handleVideoClick,
            showChat,
            handleSharing,
            isBoardOpened,
            setIsBoardOpened,
            isLogOpened,
            setIsLogOpened,
            leaveMeeting,
            question,
            questionToggle,
            hand,
            handUp,
          }}
        />
        <Button
          type="fullScreen"
          method={handleFullScreen}
          condition={fullScreen}
        />
        <LessonLog
          className={isLogOpened ? style.opened : style.closed}
          {...{
            handleFullScreen,
            goToVideoCall,
            userId,
            logRef,
            wrapperRef,
            isTeacher,
          }}
        />
        <Board
          socket={socket}
          className={isBoardOpened ? style.opened : style.closed}
          {...{ goToVideoCall }}
        />
      </div>

      {/* {question ? (
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
      ) : null} */}
    </div>
  );
};

export default memo(Video);

import React, { useState, useContext, memo } from "react";
import QuestionModal from "./questionModal";
import Board from "../Board";
import { UserInfoContext } from "../../Context/userInfoContext";
import { Button } from "../Button";
import UserVideos from "../UsersVideoContainer";
import UserList from "../UserList";
import style from "./style.module.scss";
import { DimensionsContext } from "../../App";
import MenuBar from "./MenuBar";
import Chat from "../Chat";

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

  const [microphone, setMicrophone] = useState(props.microphone);
  const [notification, setNotification] = useState(false);
  const [questionNotification, setQuestionNotification] = useState(false);
  const [question, setQuestion] = useState(false);
  const [hand, setHand] = useState(false);
  const [sendedQuestions, setSendedQuestions] = useState([]);
  const [board, setBoard] = useState(false);
  const { users } = useContext(UserInfoContext);

  const showUser = () => {
    setIsUserListOpened(!isUserListOpened);
    setIsChateOpened(false);
  };
  const showChat = () => {
    setIsUserListOpened(false);
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
            : isChateOpened
            ? style.videoContainerSmall
            : style.videoContainerFull
        }
      >
        {board ? (
          <Board socket={socket} setBoard={setBoard} />
        ) : (
          <UserVideos
            style={{ width: width / 5 }}
            {...{
              users,
              selfId: userId,
              selfStream: props.stream,
              selfScreenStream: screenStream,
            }}
          />
        )}
        <MenuBar
          {...{
            showUser,
            microphone,
            handleMicrophoneClick,
            videoPlayer,
            handleVideoClick,
            showChat,
            handleSharing,
            board,
            setBoard,
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
      </div>

      <Chat className={isChateOpened ? style.chat : style.chatHide} />

      {/*  */}

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

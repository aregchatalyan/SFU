import React, { useState, useContext, memo, useRef } from "react";
import Board from "../Board";
import { UserInfoContext } from "../../Context/userInfoContext";
import { Button } from "../Button";
import UserVideos from "../UsersVideoContainer";
import UserList from "../UserList";
import style from "./style.module.scss";
import { DimensionsContext } from "../../Context";
import MenuBar from "./MenuBar";
import LessonLog from "../LessonLog";
import { useOutsideClick } from "../../hooks";
import Chat from "../Chat";

const isTeacher = true;

const Video = ({
  userId,
  stream,
  screenStream,
  audioPermission,
  handleStopAudioOnly,
  fullScreen,
  handleFullScreen,
  videoPlayer,
  handleVideoClick,
  socket,
  handleSharing,
  leaveMeeting,
  microphone: mic,
  massages,
}) => {
  const wrapperRef = useRef(null);
  const logRef = useRef(null);
  const { active: isLogOpened, setActive: setIsLogOpened } = useOutsideClick(
    logRef,
    wrapperRef
  );
  const { width, height } = useContext(DimensionsContext);
  const { users } = useContext(UserInfoContext);
  const [isUserListOpened, setIsUserListOpened] = useState(false);
  const [isBoardOpened, setIsBoardOpened] = useState(false);
  const [isChateOpened, setIsChateOpened] = useState();

  const [microphone, setMicrophone] = useState(mic);
  const [question, setQuestion] = useState(false);
  const [hand, setHand] = useState(false);

  const showUser = () => {
    setIsUserListOpened(!isUserListOpened);
  };

  const goToVideoCall = () => {
    setIsBoardOpened(false);
    setIsLogOpened(false);
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
  };

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
            selfStream: stream,
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
            handleSharing,
            leaveMeeting,
            question,
            questionToggle,
            hand,
            handUp,
            isBoardOpened,
            setIsBoardOpened,
            isLogOpened,
            setIsLogOpened,
            isChateOpened,
            setIsChateOpened,
          }}
        />
        <Button
          type="fullScreen"
          method={handleFullScreen}
          condition={fullScreen}
        />
        <Board
          className={isBoardOpened ? style.opened : style.closed}
          {...{ goToVideoCall }}
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
        <Chat
          className={isChateOpened ? style.chat : style.chatHide}
          {...{ socket, userId, massages }}
        />
      </div>
    </div>
  );
};

export default memo(Video);

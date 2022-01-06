import React, { useState, useContext, memo, useRef } from "react";
import { DimensionsContext, UserInfoContext } from "../../../Context";
import { useOutsideClick } from "../../../hooks";
import Board from "../../board";
import Controllers from "../../controllers";
import HandUpRoute from "../../handUpRoute";
import LessonLog from "../../lessonLog";
import UserList from "../../userList";
import UserVideos from "../../usersVideoContainer";
import style from "./style.module.scss";

const isTeacher = false;

const VideoCall = ({
  userId,
  stream,
  screenStream,
  audioPermission,
  handleStopAudioOnly,
  fullScreen,
  handleFullScreen,
  videoPlayer,
  handleVideoClick,
  microphone,
  handleMicrophoneClick,
  socket,
  handleSharing,
  leaveMeeting,
  massages,
  hands,
  setHands,
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

  const goToVideoCall = () => {
    setIsBoardOpened(false);
    setIsLogOpened(false);
  };

  return (
    <div className={style.fullScreenWrapper} style={{ width, height }}>
      <UserList
        className={isUserListOpened ? style.userList : style.userListHide}
        {...{
          isUserListOpened,
          setIsUserListOpened,
          selfId: userId,
          videoPlayer,
        }}
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
        <Controllers
          {...{
            isUserListOpened,
            setIsUserListOpened,
            videoPlayer,
            handleVideoClick,
            leaveMeeting,
            microphone,
            handleMicrophoneClick,
            handleSharing,
            isBoardOpened,
            setIsBoardOpened,
            isLogOpened,
            setIsLogOpened,
            fullScreen,
            socket,
            userId,
            massages,
          }}
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
        <HandUpRoute {...{ hands, setHands }} />
      </div>
    </div>
  );
};

export default memo(VideoCall);

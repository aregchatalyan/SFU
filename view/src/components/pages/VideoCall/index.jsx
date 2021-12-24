import React, { useState, useContext, memo, useRef } from "react";
import style from "./style.module.scss";

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
};
export default VideoCall;

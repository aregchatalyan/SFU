import React from "react";
import { LeftSideMenu } from "./LeftSideMenu/LeftSideMenu";
import { MainMenu } from "./MainMenu/MainMenu";
import RightSideMenu from "./RightSideMenu";
import style from "./style.module.scss";
import useMouseMoveTimeOut from "../hook";

const MenuBar = ({
  showUser,
  microphone,
  handleMicrophoneClick,
  videoPlayer,
  handleVideoClick,
  showChat,
  handleSharing,
  leaveMeeting,
  isBoardOpened,
  setIsBoardOpened,
  isLogOpened,
  setIsLogOpened,
  question,
  questionToggle,
  hand,
  handUp,
}) => {
  return (
    <div className={style.controlers}>
      <div className={style.controllersWrapper}>
        <LeftSideMenu showUser={showUser} />
        <MainMenu
          microphone={microphone}
          microphoneClick={handleMicrophoneClick}
          video={videoPlayer}
          videoClick={handleVideoClick}
          notification={false}
          msgClick={showChat}
          shareScreen={handleSharing}
          leaveMeeting={leaveMeeting}
        />
        <RightSideMenu
          request={question}
          openRequest={questionToggle}
          hand={hand}
          handUp={handUp}
          {...{
            isBoardOpened,
            openBoard: () => {
              setIsBoardOpened(!isBoardOpened);
              setIsLogOpened(false);
            },
            isLogOpened,
            openLog: () => {
              setIsBoardOpened(false);
              setIsLogOpened(!isLogOpened);
            },
          }}
        />
      </div>
    </div>
  );
};

export default MenuBar;

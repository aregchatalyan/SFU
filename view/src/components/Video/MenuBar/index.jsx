import React from "react";
import { LeftSideMenu } from "./LeftSideMenu/LeftSideMenu";
import { MainMenu } from "./MainMenu/MainMenu";
import RightSideMenu from "./RightSideMenu";
import style from "./style.module.scss";

const MenuBar = ({
  showUser,
  microphone,
  handleMicrophoneClick,
  videoPlayer,
  handleVideoClick,
  showChat,
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
}) => {
  return (
    <div className={style.controlers}>
      <div className={style.controllersWrapper}>
        <LeftSideMenu {...{ showUser }} />
        <MainMenu
          microphone={microphone}
          microphoneClick={handleMicrophoneClick}
          video={videoPlayer}
          videoClick={handleVideoClick}
          notification={false}
          msgClick={showChat}
          shareScreen={handleSharing}
          leaveMeeting={leaveMeeting}
          {...{
            openChat: () => {
              setIsChateOpened(!isChateOpened);
              setIsLogOpened(false);
            },
          }}
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

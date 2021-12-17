import React from "react";
import { LeftSideMenu } from "./LeftSideMenu/LeftSideMenu";
import { MainMenu } from "./MainMenu/MainMenu";
import { RightSideMenu } from "./RightSideMenu/RightSideMenu";
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
  board,
  setBoard,
  question,
  questionToggle,
  hand,
  handUp,
}) => {
  const showMenuBar = useMouseMoveTimeOut();
  return (
    <div className={showMenuBar ? style.controlers : style.controlersHide}>
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
  );
};

export default MenuBar;

import React from "react";
import { ButtonWithTextAndIcon, ButtonWithSlider } from "../core/Button";
import style from "./style.module.scss";

const SubBar = ({
  handleSharing,
  isBoardOpened,
  setIsBoardOpened,
  isLogOpened,
  setIsLogOpened,
  PollButtons,
  closePollModal,
  closeCreatePollModal,
}) => {
  return (
    <div className={style.subBarWrapper}>
      <ButtonWithTextAndIcon
        active={isBoardOpened}
        iconName="videocall_blackboard"
        text="Blackboard"
        onClick={() => {
          setIsBoardOpened(!isBoardOpened);
          setIsLogOpened(false);
          closePollModal(false);
          closeCreatePollModal(false);
        }}
      />
      <ButtonWithTextAndIcon
        active={isLogOpened}
        iconName="videocall_gradebook"
        text="Grade Book"
        onClick={() => {
          setIsLogOpened(!isLogOpened);
          setIsBoardOpened(false);
          closePollModal(false);
          closeCreatePollModal(false);
        }}
      />
      <ButtonWithTextAndIcon
        iconName="videocall_screenshare"
        text="Screen Share"
        onClick={handleSharing}
      />
      <ButtonWithSlider
        iconName="videocall_poll"
        text="Poll"
        {...{
          buttons: PollButtons,
          cb: () => {
            setIsBoardOpened(false);
            setIsLogOpened(false);
          },
        }}
      />
    </div>
  );
};
export default SubBar;

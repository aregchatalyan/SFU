import React, { useState, useRef } from "react";
import { CustomButtonWithIcon } from "../core/Button";
import CircleButton, {
  CircleButtonWithHover,
  CircleButtonWhithStates,
  CircleButtonCustom,
} from "../core/Button/CircleButton";
import style from "./style.module.scss";
import { useComponentHover } from "../../hooks/useComponenetHover";
import Chat from "../chat";
import CustomInput from "../core/Input";

const Controllers = ({
  isUserListOpened,
  setIsUserListOpened,
  videoPlayer,
  handleVideoClick,
  leaveMeeting,
  microphone,
  handleMicrophoneClick,
  fullScreen,
  socket,
  userId,
  massages,
  handlFix,
}) => {
  const controllersRef = useRef(null);
  const [isChatFixed, setIsChatFixed] = useState(false);
  const [isInputOpened, setIsInputOpened] = useState(false);
  const isControllersOpened = useComponentHover(controllersRef);

  return (
    <div className={style.controllersArea} ref={controllersRef}>
      <div
        className={
          isControllersOpened || true
            ? style.controllersWrapper
            : style.controllersWrapperHide
        }
      >
        <div className={style.controllers}>
          <div
            className={
              isInputOpened ? style.inputWrapper : style.inputWrapperHide
            }
          >
            <CircleButtonCustom
              iconName="massage_exit"
              className={style.closeInput}
              onClick={() => setIsInputOpened(false)}
            />
            <CustomInput className={style.msginput} />
            <CircleButtonCustom
              iconName="massage_send"
              className={style.sendMsg}
            />
          </div>
          <CircleButtonWithHover
            iconName="videocall_massage"
            {...{
              state: isChatFixed || isInputOpened,
              isInputOpened,
              handlFix: () => setIsChatFixed(!isChatFixed),
              onClick: () => setIsInputOpened(true),
            }}
          >
            <Chat {...{ userId, massages }} />
          </CircleButtonWithHover>
          <CircleButton
            iconName="videocall_userlist"
            {...{
              state: isUserListOpened,
              onClick: () => {
                setIsUserListOpened(!isUserListOpened);
              },
            }}
          />
          <CircleButtonWhithStates
            iconName={videoPlayer ? "videocall_video" : "videocall_video_off"}
            {...{ state: videoPlayer, onClick: handleVideoClick }}
          />
          <CustomButtonWithIcon
            className={style.hangUpbutton}
            width={24}
            height={24}
            iconName="videocall_hangup"
            onClick={leaveMeeting}
          />
          <CircleButtonWhithStates
            iconName={microphone ? "videocall_voice" : "videocall_voice_off"}
            {...{ state: microphone, onClick: handleMicrophoneClick }}
          />
          <CircleButton iconName="videocall_hand" onClick={() => {}} />
          <CircleButtonWithHover iconName="videocall_etc" />
        </div>
      </div>
    </div>
  );
};
export default Controllers;

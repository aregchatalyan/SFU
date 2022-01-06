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
import SubBar from "./SubBar";
import { CircleActionButton } from "../core/Button/CircleButton/CircleActionButton";

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
  handleSharing,
  isBoardOpened,
  setIsBoardOpened,
  isLogOpened,
  setIsLogOpened,
}) => {
  const controllersRef = useRef(null);
  const [isChatFixed, setIsChatFixed] = useState(false);
  const [isInputOpened, setIsInputOpened] = useState(false);
  const isControllersOpened = useComponentHover(controllersRef);
  const [inputValue, setInputValue] = useState("");

  const sendMsg = () => {
    if (inputValue.length > 0) {
      socket.emit("addMassage", { userId, text: inputValue });
      setInputValue("");
    }
  };
  const handUp = () => {
    socket.emit("handUp", { userId });
  };

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
              width={24}
              height={24}
            />
            <CustomInput
              className={style.msginput}
              {...{ inputValue, setInputValue }}
            />
            <CircleButtonCustom
              iconName="massage_send"
              className={style.sendMsg}
              onClick={sendMsg}
              width={24}
              height={24}
            />
          </div>
          <div
            className={
              isInputOpened ? style.buttonWrapperHide : style.buttonWrapper
            }
          >
            <CircleButtonWithHover
              iconName="videocall_massage"
              {...{
                state: isChatFixed || isInputOpened,
                handlFix: () => setIsChatFixed(!isChatFixed),
                onClick: () => setIsInputOpened(true),
                showLocker: !isInputOpened,
                opened: style.msgBar,
                closed: style.msgBarHide,
                unLocked: style.lockMsgBar,
                locked: style.lockMsgBarLocked,
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
            {/* <CircleButtonCustom
              iconName="videocall_hand"
              onClick={() => {}}
              width={48}
              className={style.handUpBtn}
            /> */}

            <CircleActionButton onClick={handUp} />

            <CircleButtonWithHover
              iconName="videocall_etc"
              {...{ opened: style.etcWrapper, closed: style.etcWrapperHide }}
              showLocker={false}
            >
              <SubBar
                {...{
                  handleSharing,
                  isBoardOpened,
                  setIsBoardOpened,
                  isLogOpened,
                  setIsLogOpened,
                }}
              />
            </CircleButtonWithHover>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Controllers;

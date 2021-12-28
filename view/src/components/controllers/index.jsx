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
            <svg width="48" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="rgba(35, 35, 35, 0.4)"
                stroke="#6A6A6A"
                stroke-width="1"
              />
              <path
                class="circle"
                stroke-dasharray="0, 100"
                d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                stroke-linecap="round"
              />
              <svg width="24" height="24" viewBox="0 0 24 24" x="6" y="6">
                <g clip-path="url(#clip0_8378_184058)">
                  <path
                    d="M20.3056 6.07229C20.3062 5.48042 20.0762 4.92382 19.6579 4.50512C19.2397 4.08642 18.6834 3.85579 18.0915 3.85579C17.8099 3.85579 17.5404 3.90948 17.2922 4.00622L17.2944 2.80038C17.2959 2.20798 17.0662 1.65077 16.6478 1.23137C16.2294 0.81201 15.6727 0.580996 15.0803 0.580996H15.0477C14.6037 0.580996 14.19 0.713105 13.8429 0.939409C13.7707 0.837443 13.69 0.740469 13.6 0.650277C13.1816 0.23092 12.6249 0 12.0326 0H11.9924C10.9804 0 10.1255 0.682633 9.86235 1.61135C9.59107 1.49252 9.29176 1.42612 8.9771 1.42612H8.95144C7.73057 1.42612 6.73733 2.41936 6.73733 3.64022V8.10889C6.48479 8.00928 6.21007 7.95389 5.92254 7.95389C4.69419 7.95389 3.69482 8.95321 3.69482 10.1816V15.6997C3.69482 20.2765 7.41836 24 11.9952 24C14.2144 24 16.3001 23.1352 17.8683 21.565C19.4364 19.9948 20.2984 17.9079 20.2955 15.6886L20.2924 13.3309L20.3056 6.07229ZM18.8825 15.6905C18.885 17.5319 18.1697 19.2636 16.8685 20.5665C15.5673 21.8695 13.8365 22.587 11.9951 22.587C8.1974 22.587 5.10775 19.4973 5.10775 15.6997V10.1816C5.10775 9.7323 5.47328 9.36682 5.92254 9.36682C6.37181 9.36682 6.73733 9.7323 6.73733 10.1816V13.8934C6.73733 14.2836 7.05364 14.5999 7.44379 14.5999C8.69833 14.5999 9.71899 15.6205 9.71899 16.8751V18.0312C9.71899 18.4214 10.0353 18.7377 10.4255 18.7377C10.8156 18.7377 11.1319 18.4214 11.1319 18.0312V16.8751C11.1319 15.083 9.84714 13.5853 8.15026 13.2549V3.64022C8.15026 3.19845 8.50966 2.83904 8.95144 2.83904H8.9771C9.41883 2.83904 9.77819 3.1984 9.77828 3.64008V10.1569C9.77828 10.547 10.0946 10.8633 10.4847 10.8633C10.8749 10.8633 11.1912 10.547 11.1912 10.1569C11.1912 9.11047 11.1912 3.0938 11.1912 2.21406C11.1912 1.77228 11.5506 1.41288 11.9924 1.41288H12.0326C12.2469 1.41288 12.4483 1.49643 12.5997 1.64818C12.7511 1.79988 12.8342 2.00151 12.8337 2.21604C12.829 4.5793 12.8221 7.81439 12.8181 10.1621C12.8173 10.5522 13.133 10.8691 13.5231 10.8699H13.5245C13.9141 10.8699 14.2302 10.5545 14.231 10.1648C14.234 8.57605 14.2424 4.31395 14.2465 2.79317C14.2475 2.35243 14.6069 1.99383 15.0477 1.99383H15.0803C15.2947 1.99383 15.4961 2.07738 15.6475 2.22918C15.7989 2.38093 15.882 2.5826 15.8815 2.79727C15.877 5.0945 15.8696 8.72728 15.866 11.0047C15.8653 11.3948 16.181 11.7118 16.5712 11.7125H16.5725C16.9621 11.7124 17.2782 11.3971 17.279 11.0073C17.2799 10.6569 17.2869 6.21698 17.2904 6.06561C17.2926 5.62609 17.652 5.26853 18.0915 5.26853C18.3057 5.26853 18.507 5.35194 18.6583 5.5035C18.8097 5.65501 18.8929 5.8564 18.8927 6.07003L18.8795 13.3304L18.8825 15.6905Z"
                    fill="white"
                  />
                </g>
              </svg>
            </svg>
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

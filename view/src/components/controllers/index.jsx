import React, { useState, useRef, useEffect } from 'react'
import { CustomButtonWithIcon } from '../core/Button'
import CircleButton, {
  CircleButtonWithHover,
  CircleButtonWhithStates,
  CircleButtonCustom,
  CircleActionButton,
} from '../core/Button/CircleButton'
import style from './style.module.scss'
import { useActiveTimeOut } from '../../hooks'
import Chat from '../chat'
import CustomInput from '../core/Input'
import SubBar from './SubBar'

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
  closePollModal,
  closeCreatePollModal,
  isLogOpened,
  setIsLogOpened,
  isHomeWorkOpened,
  setIsHomeWorkOpened,
  polls,
  isPollModalOpened,
  unWatchedPoll,
  setUnWatchedPoll,
  PollButtons,
  screenStream,
}) => {
  const controllersRef = useRef(null)
  const [isChatFixed, setIsChatFixed] = useState(false)
  const [isInputOpened, setIsInputOpened] = useState(false)
  const isControllersOpened = useActiveTimeOut(controllersRef)
  const [inputValue, setInputValue] = useState('')
  const [isSubBarOpened, setisSubBarOpened] = useState(false)
  const [unWatchedMsg, setUnWatchedMsg] = useState(false)

  const sendMsg = () => {
    if (inputValue.length > 0) {
      socket.emit('addMassage', { userId, text: inputValue })
      setInputValue('')
    }
  }
  const handUp = () => {
    socket.emit('handUp', { userId })
  }
  const closeChat = () => setIsChatFixed(false)

  useEffect(() => {
    if (!isChatFixed && !isInputOpened && massages.length > 0) {
      setUnWatchedMsg(true)
    }
  }, [massages]) // eslint-disable-line

  useEffect(() => {
    if (!isPollModalOpened && polls.length > 0) {
      setUnWatchedPoll(true)
    }
  }, [polls]) // eslint-disable-line

  return (
    <div
      className={
        isControllersOpened || isInputOpened
          ? style.controllersArea
          : style.controllersAreaHide
      }
      ref={controllersRef}
    >
      <div
        className={
          isControllersOpened || isInputOpened || isChatFixed
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
            <div className={style.msgInputWrapper}>
              <CustomInput
                className={style.msginput}
                {...{
                  inputValue,
                  setInputValue,
                  submit: sendMsg,
                  placeholder: 'Write your message',
                }}
              />
            </div>
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
                isChatFixed,
                handlFix: () => {
                  setIsChatFixed(!isChatFixed)
                  setUnWatchedMsg(false)
                },
                onClick: () => {
                  setIsInputOpened(true)
                  setIsBoardOpened(false)
                  setIsLogOpened(false)
                  closeCreatePollModal()
                  closePollModal()
                  setUnWatchedMsg(false)
                },
                showLocker: isControllersOpened,
                opened: style.msgBar,
                closed: style.msgBarHide,
                unLocked: style.lockMsgBar,
                locked: style.lockMsgBarLocked,
                isOpenDenied:
                  isSubBarOpened ||
                  isBoardOpened ||
                  isLogOpened ||
                  massages.length === 0,
                newNotification: unWatchedMsg,
              }}
            >
              <Chat {...{ userId, massages }} />
            </CircleButtonWithHover>
            <CircleButton
              iconName="videocall_userlist"
              {...{
                state: isUserListOpened,
                onClick: () => {
                  setIsUserListOpened(!isUserListOpened)
                },
              }}
            />
            <CircleButtonWhithStates
              iconName={videoPlayer ? 'videocall_video' : 'videocall_video_off'}
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
              iconName={microphone ? 'videocall_voice' : 'videocall_voice_off'}
              {...{ state: microphone, onClick: handleMicrophoneClick }}
            />
            <CircleActionButton onClick={handUp} />
            <CircleButtonWithHover
              iconName="videocall_etc"
              {...{
                opened: style.etcWrapper,
                closed: style.etcWrapperHide,
                setisSubBarOpened,
                newNotification: unWatchedPoll,
              }}
              showLocker={false}
            >
              <SubBar
                {...{
                  handleSharing,
                  isBoardOpened,
                  setIsBoardOpened,
                  isLogOpened,
                  setIsLogOpened,
                  isHomeWorkOpened,
                  setIsHomeWorkOpened,
                  PollButtons,
                  closePollModal,
                  closeCreatePollModal,
                  closeChat,
                  unWatchedPoll,
                  setIsUserListOpened,
                  screenStream,
                }}
              />
            </CircleButtonWithHover>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Controllers

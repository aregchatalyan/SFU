import React, { useState, memo, useRef } from 'react'
import { useOutsideClick } from '../../../hooks'
import Board from '../../board2'
import ConnectionMsg from '../../connectionMsg'
import Controllers from '../../controllers'
import { CustomButtonWithIcon } from '../../core/Button'
import HandUpRoute from '../../handUpRoute'
import HomeWork from '../../homework'
import LessonLog from '../../lessonLog'
import usePollModal, { useCreatePollModal } from '../../poll'
import ShareMsg from '../../shareMsg'
import UserList from '../../userList'
import UserVideos from '../../usersVideoContainer'
import style from './style.module.scss'

const VideoCall = ({
  userId,
  stream,
  screenStream,
  handleFullScreen,
  videoPlayer,
  handleVideoClick,
  microphone,
  handleMicrophoneClick,
  handleSharing,
  handleLeaveMeeting,
  massages,
  hands,
  polls,
  audioStream,
  connecting,
  disconnectedUsers,
}) => {
  const wrapperRef = useRef(null)
  const logRef = useRef(null)
  const { active: isLogOpened, setActive: setIsLogOpened } = useOutsideClick(
    logRef,
    wrapperRef
  )
  const [isUserListOpened, setIsUserListOpened] = useState(false)
  const [isBoardOpened, setIsBoardOpened] = useState(false)
  const [isHomeWorkOpened, setIsHomeWorkOpened] = useState(false)
  const [unWatchedPoll, setUnWatchedPoll] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)

  const goToVideoCall = () => {
    setIsBoardOpened(false)
    setIsLogOpened(false)
    setIsHomeWorkOpened(false)
  }
  const [PallModal, PollModalButton, closePollModal, isPollModalOpened] =
    usePollModal({
      polls,
      userId,
      notification: unWatchedPoll,
    })
  const [CreatePallModal, CreatePollModalButton, closeCreatePollModal] =
    useCreatePollModal({ selfId: userId })
  return (
    <div className={style.fullScreenWrapper}>
      {!isBoardOpened && !isLogOpened && (
        <CustomButtonWithIcon
          iconName="full_screen"
          width={20}
          height={20}
          className={style.fullScreenButton}
          onClick={handleFullScreen}
        />
      )}
      {screenStream && <ShareMsg onClick={handleSharing} />}
      {connecting && <ConnectionMsg />}
      <UserList
        className={isUserListOpened ? style.userList : style.userListHide}
        {...{
          isUserListOpened,
          setIsUserListOpened,
          selfId: userId,
          videoPlayer,
          audioStream,
          selectedUserId,
          setSelectedUserId,
          selfStream: stream,
          selfScreenStream: screenStream,
          microphone,
          disconnectedUsers,
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
          {...{
            selfId: userId,
            selfStream: stream,
            microphone,
            selectedUserId,
            setSelectedUserId,
            isUserListOpened,
            disconnectedUsers,
          }}
        />
        <Controllers
          {...{
            isUserListOpened,
            setIsUserListOpened,
            videoPlayer,
            handleVideoClick,
            handleLeaveMeeting,
            microphone,
            handleMicrophoneClick,
            handleSharing,
            isBoardOpened,
            setIsBoardOpened,
            isLogOpened,
            setIsLogOpened,
            isHomeWorkOpened,
            setIsHomeWorkOpened,
            closePollModal,
            closeCreatePollModal,
            userId,
            massages,
            polls,
            isPollModalOpened,
            unWatchedPoll,
            setUnWatchedPoll,
            screenStream,
            PollButtons: [
              {
                cb: () => {
                  closeCreatePollModal()
                  setUnWatchedPoll(false)
                },
                ...PollModalButton,
              },
              { cb: closePollModal, ...CreatePollModalButton },
            ],
          }}
        />

        <Board
          className={isBoardOpened ? style.opened : style.closed}
          {...{ goToVideoCall, selfId: userId, handleFullScreen }}
        />
        <LessonLog
          className={isLogOpened ? style.opened : style.closed}
          {...{
            handleFullScreen,
            goToVideoCall,
            userId,
            logRef,
            wrapperRef,
          }}
        />
        <HomeWork
          className={isHomeWorkOpened ? style.opened : style.closed}
          {...{ handleFullScreen, goToVideoCall }}
        />
        <HandUpRoute {...{ hands }} />
        {PallModal}
        {CreatePallModal}
      </div>
    </div>
  )
}

export default memo(VideoCall)

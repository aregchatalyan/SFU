import React from 'react'
import { ButtonWithTextAndIcon, ButtonWithSlider } from '../core/Button'
import style from './style.module.scss'

const SubBar = ({
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
}) => {
  return (
    <div className={style.subBarWrapper}>
      <ButtonWithTextAndIcon
        active={isBoardOpened}
        iconName="videocall_blackboard"
        text="Blackboard"
        onClick={() => {
          setIsBoardOpened(!isBoardOpened)
          setIsLogOpened(false)
          closePollModal(false)
          closeCreatePollModal(false)
          closeChat()
          setIsUserListOpened(false)
        }}
      />

      <ButtonWithTextAndIcon
        active={isLogOpened}
        iconName="videocall_gradebook"
        text="Grade Book"
        onClick={() => {
          setIsLogOpened(!isLogOpened)
          setIsBoardOpened(false)
          closePollModal(false)
          closeCreatePollModal(false)
          closeChat()
        }}
      />
      <ButtonWithTextAndIcon
        iconName={
          screenStream ? 'videocall_stop_screenshare' : 'videocall_screenshare'
        }
        text={screenStream ? 'Stop Sharing' : 'Screen Share'}
        onClick={handleSharing}
        textStyle={{ color: screenStream && 'white' }}
      />

      <ButtonWithTextAndIcon
        active={isHomeWorkOpened}
        hoverStrock={true}
        iconName="videocall_homeworks"
        text="Homeworks"
        onClick={() => {
          setIsHomeWorkOpened(!isHomeWorkOpened)
          setIsLogOpened(false)
          setIsBoardOpened(false)
          closePollModal(false)
          closeCreatePollModal(false)
          closeChat()
        }}
      />

      <ButtonWithSlider
        iconName="videocall_poll"
        text="Poll"
        {...{
          buttons: PollButtons,
          cb: () => {
            setIsBoardOpened(false)
            setIsLogOpened(false)
            closeChat()
          },
          notification: unWatchedPoll,
        }}
      />
    </div>
  )
}
export default SubBar

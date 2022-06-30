import React, { useContext } from 'react'
import { SocketContext } from '../../Context'
import { CustomButtonWithIcon } from '../core/Button'
import Icon from '../core/Icon'
import useModalWithButton from '../core/Modal/index'
import Question from '../core/Question'
import style from './style.module.scss'

export { useCreatePollModal } from './useCreatePoll'

const Children = ({ polls, closeModal, userId }) => {
  const socket = useContext(SocketContext)

  const handleVote = (questionId) => (versionId) => () => {
    console.log(`questionId`, questionId)
    socket.emit('votePoll', { userId, questionId, versionId })
  }

  return (
    <div className={style.pollContainer}>
      <div className={style.header}>
        <span>All Polls</span>
        <CustomButtonWithIcon
          iconName="close_poll_modal"
          width={24}
          height={24}
          onClick={closeModal}
          className={style.closeBtn}
        />
      </div>
      <div className={style.qusetionsContainer}>
        {polls.length > 0 ? (
          polls.map(({ id, text: question, ...otherProps }, key, arr) => (
            <Question
              {...{
                question,
                onVersionSelect: handleVote(id),
                ...otherProps,
              }}
              key={arr.length - key}
            />
          ))
        ) : (
          <div className={style.emptyPlacholder}>
            <Icon name="no_poll" width={40} height={40}/>
            <div className={style.emptyText}>
              <span className={style.textHeader}>Polls are empty</span>
              <span className={style.text}>
                Create Polls and see the result here
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const usePollModal = ({ polls, userId, notification }) => {
  return useModalWithButton({
    child: ({ closeModal }) => <Children {...{ polls, closeModal, userId }} />,
    modalProps: {
      className: style.pollModalContainer,
    },
    buttonProps: {
      children: (
        <>
          <Icon name="all_poll" width={21} height={20}/>
          <span>All</span>
          {notification && (
            <Icon
              name="notification_circle"
              width={12}
              height={12}
              className={style.notificationIcon}
            />
          )}
        </>
      ),
      className: style.buttonStyle,
    },
  })
}
export default usePollModal

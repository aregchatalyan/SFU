import React, { memo, useContext, useEffect, useRef } from 'react'
import { UsersInfoContext } from '../../Context'
import { AnimatePresence, motion } from 'framer-motion'
import VideoWrapper from '../core/VideoContainer'
import VoiceWrapper from '../core/Voice'
import './style.scss'
import DragbleVideo from '../core/DragableVideo'
import { fadeIn } from '../../helpers/animation.helpers'

const countForDragaableContainerDisable = [2, 3, 5]

const UserVideos = ({
  selfId,
  selfStream,
  microphone,
  selectedUserId,
  setSelectedUserId,
  isUserListOpened,
  disconnectedUsers,
}) => {
  const { users } = useContext(UsersInfoContext)
  const appRef = useRef(null)
  const selectUser = (userId) => () =>
    setSelectedUserId((state) =>
      state === userId || users.length === 1 ? null : userId
    )
  useEffect(() => {
    if (!users.some(({ userId }) => userId === selectedUserId)) {
      setSelectedUserId(undefined)
    }
  }, [users, selectedUserId, setSelectedUserId])

  return (
    <AnimatePresence>
      <motion.div
        className={`base-grid ${
          users.lenght !== 1 && !selectedUserId
            ? `base-grid-` + users.length
            : ''
        }`}
        layout
        ref={appRef}
      >
        {selectedUserId
          ? users
              .filter(({ userId }) => userId === selectedUserId)
              .map(
                (
                  {
                    userId,
                    stream,
                    consumerId,
                    audioConsumerId,
                    audioStream,
                    screenStream,
                    ...otherProps
                  },
                  index
                ) => (
                  <div
                    className="base-grid-item"
                    onClick={selectUser(userId)}
                    key={index}
                  >
                    <VideoWrapper
                      {...{
                        id: consumerId,
                        stream: selfId === userId ? selfStream : stream,
                        screenStream,
                        isSelected: true,
                        rotate: selfId === userId,
                        connectionFaild: disconnectedUsers.includes(userId),
                        ...otherProps,
                      }}
                    />
                    {selfId !== userId && (
                      <VoiceWrapper
                        {...{
                          id: audioConsumerId,
                          audioStream,
                          on: selfId === userId && microphone,
                        }}
                      />
                    )}
                    {screenStream && stream && (
                      <DragbleVideo appRef={appRef} stream={stream} />
                    )}
                  </div>
                )
              )
          : users.map(
              (
                {
                  userId,
                  stream,
                  consumerId,
                  audioConsumerId,
                  audioStream,
                  ...otherProps
                },
                index,
                arr
              ) =>
                selfId === userId &&
                countForDragaableContainerDisable.includes(arr.length) ? (
                  <DragbleVideo
                    appRef={appRef}
                    stream={selfStream}
                    {...{
                      myMicOn: selfId === userId && microphone,
                      ...otherProps,
                      isUserListOpened,
                    }}
                    key={index}
                  />
                ) : (
                  <motion.div
                    initial={fadeIn.hidden}
                    animate={fadeIn.visible}
                    exit={fadeIn.hidden}
                    className="base-grid-item"
                    onClick={selectUser(userId)}
                    layoutId={`card-container-${userId}`}
                    key={index}
                  >
                    <VideoWrapper
                      {...{
                        id: consumerId,
                        stream: selfId === userId ? selfStream : stream,
                        ...otherProps,
                        rotate: selfId === userId,
                        connectionFaild: disconnectedUsers.includes(userId),
                      }}
                    />
                    {selfId !== userId && (
                      <VoiceWrapper
                        {...{
                          id: audioConsumerId,
                          audioStream,
                          on: selfId === userId && microphone,
                        }}
                      />
                    )}
                  </motion.div>
                )
            )}
      </motion.div>
    </AnimatePresence>
  )
}
export default memo(UserVideos)

import React, { useContext } from 'react'
import { UsersInfoContext } from '../../Context'
import { CustomButtonWithIcon } from '../core/Button'
import VideoWrapper from '../core/VideoContainer'
import VoiceWrapper from '../core/Voice'
import Icon from '../core/Icon'
import Item from './Item'
import style from './style.module.scss'

const UserList = ({
  className,
  setIsUserListOpened,
  selfId,
  selfScreenStream,
  videoPlayer,
  audioStream: myAudioStream,
  selectedUserId,
  setSelectedUserId,
  selfStream,
  microphone,
  disconnectedUsers,
}) => {
  const { users } = useContext(UsersInfoContext)

  const selectUser = (userId) => () => setSelectedUserId(userId)
  return (
    <div className={className}>
      <div className={style.header}>
        <div className={style.headerContent}>
          <CustomButtonWithIcon
            iconName="arrow_left_userlist"
            width={24}
            height={24}
            onClick={() => setIsUserListOpened(false)}
            className={style.goVideoCall}
          />
          <div className={style.content}>
            <Icon name="users_userlist" width={24} height={24} />
            <span>Members</span>
          </div>
        </div>
      </div>
      <div className={style.userListContainer}>
        {console.log('users', users)}
        {users.map(
          (
            {
              stream,
              screenStream,
              userId,
              audioStream,
              consumerId,
              audioConsumerId,
              name,
              surname,
              isTeacher,
              ...otherProps
            },
            index
          ) => {
            const isVideoOn = userId === selfId ? videoPlayer : stream
            const isScreenShare =
              userId === selfId ? selfScreenStream : screenStream

            let firsIconName = ''
            if (isVideoOn && isScreenShare) {
              firsIconName = 'userlist_screen_video'
            } else if (isVideoOn) {
              firsIconName = 'userlist_video_on'
            } else if (isScreenShare) {
              firsIconName = 'userlist_screen'
            } else {
              firsIconName = 'userlist_video_off'
            }

            const itemAudioStream =
              userId === selfId ? myAudioStream : audioStream

            return selectedUserId ? (
              selectedUserId === userId ? null : (
                <div
                  className={style.videoContainer}
                  key={index}
                  onClick={selectUser(userId)}
                >
                  <VideoWrapper
                    {...{
                      id: consumerId,
                      stream: selfId === userId ? selfStream : stream,
                      screenStream,
                      withSmallIcon: true,
                      name,
                      surname,
                      connectionFaildSmall: disconnectedUsers.includes(userId),
                      rotate: selfId === userId,
                      ...otherProps,
                    }}
                  />
                  {selfId !== userId && (
                    <VoiceWrapper
                      {...{
                        id: audioConsumerId,
                        audioStream,
                        on: true,
                      }}
                    />
                  )}
                  {(stream || (selfId === userId && selfStream)) && (
                    <div className={style.infoBar}>
                      <span className={style.nameBar}>
                        {`${name} ${surname}`}
                      </span>
                      {isTeacher && (
                        <span className={style.isTeacherText}>Teacher</span>
                      )}
                      {selfId !== userId && (
                        <div
                          className={
                            itemAudioStream
                              ? style.iconWrapperOn
                              : style.iconWrapperOff
                          }
                        >
                          <Icon
                            name={
                              itemAudioStream
                                ? 'videowrapper_audio_on'
                                : 'videowrapper_audio_off'
                            }
                            width={16}
                            height={16}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            ) : (
              <Item
                {...{
                  firsIconName,
                  itemAudioStream,
                  name,
                  surname,
                  isTeacher,
                  userId,
                  ...otherProps,
                }}
                key={index}
              />
            )
          }
        )}
      </div>
    </div>
  )
}

export default UserList

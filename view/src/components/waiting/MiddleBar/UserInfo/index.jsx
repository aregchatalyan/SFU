import React, { useContext } from 'react'
import { firstPage } from '../../../../constant'
import { RoomInfoContext } from '../../../../Context'
import CustomButton, {
  CustomButtonWithIcon,
  ButtonWithTextAndIcon,
} from '../../../core/Button'
import Spinner from '../../../core/Spinner'
import VideoWrapper from '../../../core/VideoContainer/index'
import style from './style.module.scss'

const UserInfo = ({
                    stream,
                    videoPlayer,
                    handleConfirm,
                    handleVideoClick,
                    microphone,
                    handleMicrophoneClick,
                    isJoining,
                  }) => {
  const { me } = useContext(RoomInfoContext)
  return (
    <div className={style.userInfo}>
      <div className={style.videoScreen}>
        <VideoWrapper
          stream={videoPlayer && stream}
          withSmallIcon={true}
          name={me && me.name}
          surname={me && me.surname}
          rotate={true}
        />
        <div className={style.toolBar}>
          <CustomButtonWithIcon
            iconName={videoPlayer ? 'waiting_video_on' : 'waiting_video_off'}
            width={24}
            height={24}
            onClick={handleVideoClick}
          />
          <CustomButtonWithIcon
            iconName={microphone ? 'waiting_voice_on' : 'waiting_voice_off'}
            width={24}
            height={24}
            onClick={handleMicrophoneClick}
          />
        </div>
      </div>
      {isJoining ? (
        <div className={style.joining}>
          <span className={style.title}>Connecting to Online Lesson</span>
          <span className={style.text}>
            Waiting for connect to online lesson
          </span>
          <Spinner loading={isJoining}/>
        </div>
      ) : (
        <div className={style.navbar}>
          <span className={style.title}>{firstPage.title}</span>
          <span className={style.text}>{firstPage.description}</span>
          <div className={style.btns}>
            <ButtonWithTextAndIcon
              className={style.goHome}
              iconName="waiting_go_home"
              width={20}
              height={20}
              text="Return"
            />
            <CustomButton
              text="Join Lesson"
              className={style.joinBtn}
              onClick={handleConfirm}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default UserInfo

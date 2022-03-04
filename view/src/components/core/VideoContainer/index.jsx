import React, { useRef, useEffect, memo, useState } from 'react'
import Icon from '../Icon'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeIn } from '../../../helpers/animation.helpers'
import './style.scss'
import { CustomButtonWithIcon } from '../Button'
import ConnectionMsg from '../../connectionMsg'

const VideoWrapper = ({
  id,
  stream,
  withSmallIcon,
  name,
  surname,
  screenStream,
  screenConsumerId,
  rotate,
  isSelected,
  connectionFaild,
  connectionFaildSmall,
  connecting,
}) => {
  const userVideo = useRef()
  const [isChanged, setIsChanged] = useState(false)

  const switchVideo = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsChanged((state) => !state)
  }

  useEffect(() => {
    if (userVideo.current) {
      if (screenStream && (!isChanged || !stream)) {
        userVideo.current.srcObject = screenStream
      } else {
        userVideo.current.srcObject = stream
      }
    }
  }, [stream, screenStream, isChanged])

  useEffect(() => {
    if (!screenStream || !stream) {
      setIsChanged(false)
    }
  }, [screenStream, stream])

  return (
    <AnimatePresence exitBeforeEnter>
      {(stream || screenStream) && !connecting ? (
        <>
          {screenStream && stream && !isSelected && (
            <CustomButtonWithIcon
              iconName="switch_video"
              width={24}
              height={24}
              className="switch_button"
              onClick={switchVideo}
            />
          )}
          <motion.video
            initial={fadeIn.hidden}
            animate={fadeIn.visible}
            exit={fadeIn.hidden}
            id={isChanged ? id : screenConsumerId}
            playsInline={false}
            autoPlay={true}
            ref={userVideo}
            muted
            className={`video ${rotate && 'rotated'}`}
          />
        </>
      ) : (
        <motion.div
          initial={fadeIn.hidden}
          animate={fadeIn.visible}
          exit={fadeIn.hidden}
          className="name_icon_wrapper"
        >
          <Icon
            name={
              withSmallIcon
                ? 'vidowrapper_user_small'
                : 'videowrapper_user_medium'
            }
            width={withSmallIcon ? 64 : 160}
            height={withSmallIcon ? 64 : 160}
          />
          {(connectionFaild || connectionFaildSmall) && (
            <ConnectionMsg name={name} onlyIcon={connectionFaildSmall} />
          )}
          <span
            className={withSmallIcon ? 'name_small' : 'name'}
          >{`${name} ${surname}`}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default memo(VideoWrapper)

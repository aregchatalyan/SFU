import React, { useRef, useEffect, memo } from 'react'
import Icon from '../Icon'
import style from './style.module.scss'

const VoiceWrapper = ({ id, audioStream, on }) => {
  const userAudio = useRef()

  useEffect(() => {
    if (userAudio.current) userAudio.current.srcObject = audioStream
  }, [audioStream])

  return (
    <div className={audioStream ? style.audioOn : style.audioOff}>
      {audioStream ? (
        <audio id={id} playsInline={false} autoPlay={true} ref={userAudio} />
      ) : (
        <Icon name="videowrapper_audio_off" width={16} height={16} />
      )}
    </div>
  )
}

export default memo(VoiceWrapper)

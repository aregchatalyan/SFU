import React, { useRef } from 'react'
import { useComponentHover } from '../../hooks'
import Icon from '../core/Icon'
import style from './style.module.scss'

const ShareMsg = ({ onClick }) => {
  const msgRef = useRef(null)
  const [ isHovered ] = useComponentHover(msgRef)

  return (
    <div
      ref={msgRef}
      className={
        style[`${isHovered ? 'screeShareAlertSmall' : 'screeShareAlert'}`]
      }
      onClick={onClick}
    >
      <Icon
        name={isHovered ? 'videocall_stop_screenshare' : 'my_screen_share'}
        width={24}
        height={24}
      />
      <span className={style.screenTitle}>
        {isHovered
          ? 'Stop Screen Sharing'
          : ' You are sharing your screen ....'}
      </span>
    </div>
  )
}

export default ShareMsg

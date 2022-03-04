import React, { memo } from 'react'
import { CustomButtonWithIcon } from '../core/Button'
import style from './style.module.scss'

const Header = ({ goToVideoCall }) => {
  return (
    <div className={style.header}>
      <span>Lesson Log</span>
      <CustomButtonWithIcon
        iconName="close_poll_modal"
        width={24}
        height={24}
        onClick={goToVideoCall}
      />
    </div>
  )
}
export default memo(Header)

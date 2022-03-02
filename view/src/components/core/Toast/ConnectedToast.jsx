import React from 'react'
import Icon from '../Icon'
import style from './style.module.scss'

export const ConnectedToast = ({ text }) => {
  return (
    <div className={style.connected_toast}>
      <Icon name="connection_repaired" width={24} height={24} />
      <div>
        <span>Connection has repaired</span>
        <span>You are back again</span>
      </div>
    </div>
  )
}

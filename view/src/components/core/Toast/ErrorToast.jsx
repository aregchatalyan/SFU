import React from 'react'
import Icon from '../Icon'
import style from './style.module.scss'

const ErrorToast = ({ text }) => {
  return (
    <div className={style.toastContainer}>
      <div className={style.iconWrapper}>
        <Icon name="error_toast" width={28} height={28} />
      </div>
      <div className={style.msgWrapoper}>
        <span className={style.title}>Error</span>
        <span className={style.msg}>{text}</span>
      </div>
    </div>
  )
}

export default ErrorToast

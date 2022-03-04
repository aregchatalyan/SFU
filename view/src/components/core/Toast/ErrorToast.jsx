import React from 'react'
import { Slide, toast } from 'react-toastify'
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

export const toastError = (text) => {
  toast(<ErrorToast text={text} />, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    closeButton: false,
    transition: Slide,
    style: {
      borderRadius: '8px',
      background: '#fcf6f6',
      minHeight: 48,
    },
    className: style.toastWrapper,
  })
}

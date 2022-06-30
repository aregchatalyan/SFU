import React from 'react'
import Icon from '../Icon'
import style from './style.module.scss'
import { toast, Slide } from 'react-toastify'

const ConnectedToast = ({ text }) => {
  return (
    <div className={style.connected_toast}>
      <Icon name="connection_repaired" width={24} height={24}/>
      <div>
        <span>Connection has repaired</span>
        <span>You are back again</span>
      </div>
    </div>
  )
}

export const toastConnected = () =>
  toast(<ConnectedToast/>, {
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
      borderRadius: '4px',
      minHeight: 48,
      width: '262px',
      height: '48px',
      padding: '0',
    },
  })

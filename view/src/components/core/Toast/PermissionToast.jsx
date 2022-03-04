import React from 'react'
import Icon from '../Icon'
import CustomButton from '../Button'
import style from './style.module.scss'
import { toast } from 'react-toastify'

const PermissionToast = ({ name, surname, handlePermissionChange }) => {
  return (
    <div className={style.permission_toast}>
      <div className={style.info_board}>
        <div className={style.user_info}>
          <div className={style.user_img_wrapper}>
            <Icon name="default_profile_mega_small" width={24} height={24} />
          </div>
          <span className={style.user_name_surname}>
            {`${name} ${surname}`}
          </span>
          <Icon name="videocall_blackboard" width={24} height={24} />
        </div>
        <span className={style.ask_text}>Asking to edit in blackboard</span>
      </div>
      <div className={style.action_board}>
        <CustomButton
          className={style.permissioan_accept_button}
          onClick={() => handlePermissionChange(true)}
        >
          <span className={style.accept_text}>Accept</span>
        </CustomButton>
        <CustomButton
          className={style.permissioan_decline_button}
          onClick={() => handlePermissionChange(false)}
        >
          <span className={style.decline_text}>Decline</span>
        </CustomButton>
      </div>
    </div>
  )
}

export const toastPermission = (props) => {
  toast(<PermissionToast {...props} />, {
    position: 'bottom-left',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    closeButton: false,
    style: {
      width: '272px',
      height: '124px',
      padding: '0',
      borderRadius: '8px',
      background: '#2A2A2A',
    },
  })
}

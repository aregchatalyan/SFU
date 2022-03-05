import React from 'react'
import first from '../../assets/img/user1.png'
import style from './style.module.scss'

const MassageConatiner = ({ text, isMine }) => {
  return (
    <div className={isMine ? style.myMassageWrapper : style.massageWrapper}>
      <div className={style.text}>
        <span>{text}</span>
        {!isMine && (
          <div className={style.profilePic}>
            <img src={first} alt="" />
          </div>
        )}
      </div>
    </div>
  )
}

export default MassageConatiner

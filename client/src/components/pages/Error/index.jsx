import React from 'react'
import studentImg from '../../../assets/img/student.png'
import permDenied from '../../../assets/img/noPermission.png'
import onlineLessonIcon from '../../../assets/img/onlineLesson.png'
import style from './style.module.scss'

const Error = () => {
  return (
    <div className={style.errorWrapper}>
      <div className={style.errorContainer}>
        <div className={style.msgWrapper}>
          <div className={style.msgTitle}>
            <img src={permDenied} alt=""/>
            <span>Access Denied !!!</span>
          </div>
          <div className={style.msgDesc}>
            <span>You don’t have permission to join this</span>
            <img src={onlineLessonIcon} alt=""/>
          </div>
          <div className={style.suggestionBar}/>
          <p className={style.infoBar}>
            Nec nunc nec amet, at lectus magnis cras eget lacus. Neque id sed
            pellentesque mattis fames a est venenatis risus. <br/>
            You can go back to
            <a href="https://univern.org/login"> Sign in</a> or
            <a href="https://univern.org/contact"> Contact Us</a>
          </p>
        </div>
        <div className={style.imgWrapper}>
          <img src={studentImg} alt=""/>
        </div>
      </div>
    </div>
  )
}

export default Error

import React, { useContext } from 'react'
import UserInfo from './UserInfo'
import TeacherInfo from './TeacherInfo'
import Info from './Info'
import style from './style.module.scss'
import { RoomInfoContext } from '../../../Context/roomInfoContext'

const MiddleBar = ({ ...otherProps }) => {
  const { groupName, level, courseName } = useContext(RoomInfoContext)
  return (
    <div className={style.middleBar}>
      <div className={style.title}>
        <Info text={'onlineLessons'} type="large" color="#A93AFF" />

        {groupName}
      </div>
      <div className={style.head}>
        <div className={style.text}>
          <div className={`bigCircle ${level}`} />
          <span>{courseName}</span>
        </div>
      </div>
      <UserInfo {...{ ...otherProps }} />
      <TeacherInfo />
    </div>
  )
}
export default MiddleBar

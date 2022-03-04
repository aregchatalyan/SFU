import React from 'react'
import user1 from '../../../assets/img/user1.png'
import style from './style.module.scss'

export default function Student({
  info,
  withBorder,
  isTeacher,
  ...otherProps
}) {
  const { name, surname, grade, absentCount, attendingPercent } = info || {}
  return (
    <div
      className={withBorder ? style.studentWithShadow : style.student}
      {...otherProps}
    >
      <div className={style.auth}>
        <div className={style.pic}>
          <img src={user1} alt={name + ' ' + surname + 'photo'} />
        </div>
        <span className={style.name}>{name + ' ' + surname}</span>
      </div>
      {!isTeacher && (
        <ul className={style.studentInfo}>
          <li className={style.grade}>{grade}</li>
          <li className={style.absent}>{absentCount}</li>
          <li className={style.attend}>{attendingPercent}</li>
        </ul>
      )}
    </div>
  )
}

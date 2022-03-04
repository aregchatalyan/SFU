import React from 'react'
import Icon from '../../../core/Icon/index'
import style from './style.module.scss'

const titles = {
  students: 'Students :',
  follower: 'Followers :',
  friend: 'Friends :',
  videoCourses: 'Video Courses :',
  onlineLessons: 'Online Lessons :',
  conference: 'Conferene :',
  liveStream: 'Live Stream :',
}

export default function Info({ text, count, type, color }) {
  if (type === 'medium') {
    return (
      <div className={style.rows}>
        <div className={style.rowName}>
          <Icon name={`waiting_teacherinfo_${text}`} width={24} height={24} />
          <span>{titles[text]}</span>
        </div>
        <div className={style.rowCount}>{count}</div>
      </div>
    )
  } else if (type === 'large') {
    return (
      <div className={style.rowsLarg}>
        <Icon name={`waiting_teacherinfo_${text}`} width={20} height={20} />
        <div className={style.titleLarge}>
          <span style={{ color: color || 'black' }}>{titles[text]}</span>
        </div>
        <div className={style.count}>{count}</div>
      </div>
    )
  }
}

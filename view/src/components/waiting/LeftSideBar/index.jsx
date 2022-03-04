import React, { useContext } from 'react'
import { RoomInfoContext } from '../../../Context/roomInfoContext'
import InsideBar from './InsideBar'
import style from './style.module.scss'

const LeftSideBar = ({ group, lessons }) => {
  const { level } = useContext(RoomInfoContext)
  return (
    <div className={style.leftSideBar}>
      <InsideBar
        title={'This Group'}
        type={'level'}
        info={'Medium'}
        arr={group}
        level={level}
      />
      <InsideBar
        title={'Upcoming Lessons'}
        type={'text'}
        info={7}
        arr={lessons}
      />
    </div>
  )
}
export default LeftSideBar

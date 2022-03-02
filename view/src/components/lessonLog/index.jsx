import React, { useState, memo } from 'react'
import Header from './header'
import ClassMates from './classMates'
import Table from './table'
import { useModalWithCallback } from '../core/Modal'
import style from './style.module.scss'

const seperate = [
  [1638302400000, 1639094400000],
  [1639180800000, 1639958400000],
  [1640044800000, 1640908800000],
]

const lessonDays = [
  {
    interval: 1638388800000,
  },
  {
    interval: 1638561600000,
  },
  {
    interval: 1638734400000,
  },
  {
    interval: 1638907200000,
  },
  {
    interval: 1639094400000,
  },
  {
    interval: 1639267200000,
  },
  {
    interval: 1639440000000,
  },
  {
    interval: 1639612800000,
  },
  {
    interval: 1639958400000,
  },
  {
    interval: 1640131200000,
  },
  {
    interval: 1640476800000,
  },
  {
    interval: 1640822400000,
  },
  {
    interval: 1640908800000,
  },
]

const LessonLog = ({
  className,
  goToVideoCall,
  handleFullScreen,
  logRef,
  wrapperRef,
}) => {
  const [[start, end], setTimeInterval] = useState(seperate[1])
  const getLogsByIndex = (index) => {
    setTimeInterval(seperate[index])
  }
  const [CommentModal, openModal] = useModalWithCallback()

  return (
    <div className={className}>
      <div className={style.lessonLog} ref={wrapperRef}>
        <div className={style.log} ref={logRef}>
          <Header {...{ goToVideoCall }} />
          <div className={style.content}>
            {CommentModal}
            <Table {...{ lessonDays, start, end, openModal }} />
            <ClassMates />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(LessonLog)

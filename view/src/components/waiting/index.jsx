import React, { memo } from 'react'
import LeftSideBar from './LeftSideBar'
import MiddleBar from './MiddleBar'
import RightSideBar from './RightSideBar'
import './style.scss'

const group = [
  {
    text: 'Machine Learning A-Z : Hands-On Python & R in Science',
    date: 'December 10 / 16:40',
  },
  {
    text: 'The Python Mega Course:Build 10 Real World Applications',
    date: 'July 9 / 16:40',
  },
  {
    text: 'The Python Mega Course:Build 10 Real World Applications',
    date: 'September 20 / 16:40',
  },
  {
    text: 'Machine Learning A-Z : Hands-On Python & R in Science',
    date: 'October 5 / 16:40',
  },
]
const lessons = [
  {
    text: 'Machine Learning A-Z : Hands-On Python & R in Science',
    date: 'December 10 / 16:40',
    level: 'professional',
  },
  {
    text: 'The Python Mega Course:Build 10 Real World Applications',
    date: 'July 9 / 16:40',
    level: 'medium',
  },
  {
    text: 'The Python Mega Course:Build 10 Real World Applications',
    date: 'September 20 / 16:40',
    level: 'beginner',
  },
  {
    text: 'Machine Learning A-Z : Hands-On Python & R in Science',
    date: 'October 5 / 16:40',
  },
]

const Waiting = ({ ...props }) => {
  return (
    <div className="fullScreen">
      <LeftSideBar group={group} lessons={lessons} />
      <MiddleBar {...props} />
      <RightSideBar />
    </div>
  )
}

export default memo(Waiting)

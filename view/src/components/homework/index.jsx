import React from 'react'
import Header from './header'
import './style.scss'

const HomeWork = ({ className, goToVideoCall, handleFullScreen }) => {
  return (
    <div className={className} style={{ backgroundColor: 'white' }}>
      <Header {...{ goToVideoCall, handleFullScreen }} />
    </div>
  )
}

export default HomeWork

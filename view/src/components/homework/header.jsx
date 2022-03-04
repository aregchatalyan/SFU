import React from 'react'
import { ButtonWithTextAndIcon, CustomButtonWithIcon } from '../core/Button'
import './style.scss'

const Header = ({ goToVideoCall, handleFullScreen }) => {
  return (
    <div className="header">
      <ButtonWithTextAndIcon
        className="goBackBtn"
        onClick={goToVideoCall}
        iconName="go_to_videocall"
        text="VideoCall"
      />
      <div className="title">
        <h1 className="titleText">HomeWorks</h1>
      </div>
      <CustomButtonWithIcon
        iconName="full_screen"
        width={20}
        height={20}
        onClick={handleFullScreen}
        className="full_screen_btn"
      />
    </div>
  )
}

export default Header

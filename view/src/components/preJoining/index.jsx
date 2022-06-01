import React from 'react'
import Spinner from '../core/Spinner/index'
import logo from '../../assets/img/waitingPageLogo.png'
import './style.scss'

const PreJoin = ({ loading }) => {
  return (
    <div className="foolPageWrapper">
      <div className="logo_spinner_wrapper">
        <div className="logo_wrapper">
          <img src={logo} alt=""/>
        </div>
        <Spinner loading={loading}/>
      </div>
    </div>
  )
}

export default PreJoin

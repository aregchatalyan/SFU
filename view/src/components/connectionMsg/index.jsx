import React from 'react'
import Icon from '../core/Icon'
import './style.scss'

const ConnectionMsg = ({ name }) => {
  return (
    <div className="msg_wrapper">
      <Icon name="connection_fail" width={16} height={16} />
      <span>{`Connection failed,${
        name ? ' ' + name + ' is' : ''
      } trying to reconnect ...`}</span>
    </div>
  )
}

export default ConnectionMsg

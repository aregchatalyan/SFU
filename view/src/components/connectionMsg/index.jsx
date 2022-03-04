import React from 'react'
import Icon from '../core/Icon'
import './style.scss'

const ConnectionMsg = ({ name, onlyIcon }) => {
  return (
    <div
      className={onlyIcon ? 'msg_wrapper_small' : 'msg_wrapper'}
      title={
        onlyIcon
          ? `Connection failed,${
              name ? ' ' + name + ' is' : ''
            } trying to reconnect ...`
          : 'Connecting...'
      }
    >
      <Icon name="connection_fail" width={16} height={16} />
      {!onlyIcon && (
        <span>{`Connection failed,${
          name ? ' ' + name + ' is' : ''
        } trying to reconnect ...`}</span>
      )}
    </div>
  )
}

export default ConnectionMsg

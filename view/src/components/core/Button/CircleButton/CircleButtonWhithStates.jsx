import React, { memo } from 'react'
import Icon from '../../Icon'
import style from './style.module.scss'

const CircleButtonWhithStates = ({ onClick, state, iconName }) => {
  return (
    <button
      onClick={onClick}
      className={
        state ? style.circleButtonWithStateActive : style.circleButtonWithState
      }
      style={{ cursor: 'pointer' }}
    >
      <Icon name={iconName} width={24} height={24} />
    </button>
  )
}

export default memo(CircleButtonWhithStates)

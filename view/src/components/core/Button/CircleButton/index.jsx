import React, { memo } from 'react'
import Icon from '../../Icon'
import style from './style.module.scss'

export { default as CircleActionButton } from './CircleActionButton'
export { default as CircleButtonCustom } from './CircleButtonCustom'
export { default as CircleButtonWithHover } from './CircleButtonWithHover'
export { default as CircleButtonWhithStates } from './CircleButtonWhithStates'

const CircleButton = ({ onClick, state, iconName }) => (
  <button
    onClick={onClick}
    className={state ? style.circleButtonActive : style.circleButton}
    style={{ cursor: 'pointer' }}
  >
    <Icon name={iconName} width={24} height={24} />
  </button>
)
export default memo(CircleButton)

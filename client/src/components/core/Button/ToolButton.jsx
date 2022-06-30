import React from 'react'
import Icon from '../Icon'
import style from './style.module.scss'

const buttons = {
  triangle: {
    iconName: 'board_trangle',
    title: 'Triangle',
  },
  rectangle: {
    iconName: 'board_rectangle',
    title: 'Rectangle',
  },
  circle: {
    iconName: 'board_circle',
    title: 'Circle',
  },
  pencil: {
    iconName: 'board_pencil',
    title: 'Pencil',
  },
  line: {
    iconName: 'board_line',
    title: 'Line',
  },
  text: {
    iconName: 'board_text',
    title: 'Text',
  },
  move: {
    iconName: 'board_move',
    title: 'Move',
  },
  pointer: {
    iconName: 'board_pointer',
    title: 'Pointer',
  },
}

const ToolButton = ({ type, toolType, setToolType }) => {
  return (
    <button
      className={
        type === toolType
          ? type === 'pointer'
            ? style.toolBtnActiveStrock
            : style.toolBtnActive
          : style.toolBtn
      }
      title={buttons[type].title}
      style={{ cursor: 'pointer' }}
      onClick={() => setToolType(type)}
    >
      <Icon name={buttons[type].iconName} width={20} height={20}/>
    </button>
  )
}

export default ToolButton

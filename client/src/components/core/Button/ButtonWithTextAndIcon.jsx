import React, { memo } from 'react'
import Icon from '../Icon'
import style from './style.module.scss'

const ButtonWithTextAndIcon = ({
                                 active,
                                 onClick,
                                 iconName,
                                 text,
                                 className,
                                 width,
                                 height,
                                 textStyle,
                                 hoverStrock,
                               }) => {
  return (
    <button
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className={
        className
          ? className
          : active && hoverStrock
            ? style.buttonWithIconAndTextStrockActive
            : hoverStrock
              ? style.buttonWithIconAndTextStrock
              : active
                ? style.buttonWithIconAndTextActive
                : style.buttonWithIconAndText
      }
    >
      <Icon
        name={iconName}
        width={width ? width : 24}
        height={height ? height : 24}
      />
      <span style={textStyle}>{text}</span>
    </button>
  )
}
export default memo(ButtonWithTextAndIcon)

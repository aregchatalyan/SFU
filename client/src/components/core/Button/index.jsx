import React, { memo } from 'react'

export { default as CustomButtonWithIcon } from './CustomButtonWithIcon'
export { default as ButtonWithTextAndIcon } from './ButtonWithTextAndIcon'
export { default as ButtonWithSlider } from './ButtonWithSlider'
export { default as ToolButton } from './ToolButton'
export { default as LoadingButton } from './LoadingButton'

const CustomButton = ({ onClick, text, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{ cursor: 'pointer' }}
    >
      {text ? text : children}
    </button>
  )
}

export default memo(CustomButton)

import React, { memo } from 'react'
import style from './style.module.scss'

const SubmitButton = ({ disabled = false, onClick, text }) => {
  return (
    <button
      className={disabled ? style.submitDisabled : style.submit}
      onClick={() => {
        if (!disabled) {
          onClick()
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      {text}
    </button>
  )
}

export default memo(SubmitButton)

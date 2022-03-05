import React, { useState, memo } from 'react'
import Icon from '../Icon'
import style from './style.module.scss'

const CheckBox = ({ label, checked, disable, onSelect }) => {
  const [isChecked, setisChecked] = useState(false)
  return (
    <button
      onClick={() => {
        if (!disable) {
          setisChecked(!isChecked)
          onSelect()
        }
      }}
      style={{ cursor: 'pointer' }}
      className={style.checkBoxWrapper}
    >
      {isChecked || checked ? (
        <Icon name="checkbox_checked" width={24} height={24} />
      ) : (
        <div className={style.checkBox} />
      )}
      {label && <span>{label}</span>}
    </button>
  )
}

export default memo(CheckBox)

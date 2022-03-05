import React, { memo } from 'react'
import Icon from '../Icon'
import style from './style.module.scss'

const SwitchCheckBox = ({
  name,
  context,
  setContext,
  label,
  state,
  callBack,
}) => {
  return (
    <button
      className={style.switchCheckBoxContainer}
      onClick={() => {
        if (context) {
          setContext((state) => ({ ...state, [name]: !context[name] }))
        } else {
          callBack(!state)
        }
      }}
    >
      <div
        className={style.switchCheckBoxWrapper}
        style={
          (context && context[name]) || state
            ? { background: '#ED2A26', border: 0, cursor: 'pointer' }
            : { cursor: 'pointer' }
        }
      >
        <div
          className={style.circle}
          style={
            (context && context[name]) || state
              ? { transform: 'translateX(29px)' }
              : {}
          }
        />
      </div>
      {label && <span>{label}</span>}
      {label && (
        <div className={style.questionMarkWrapper}>
          <Icon name="question_mark" width={16} height={16} />
          <div className={style.helpTextWrapper}>
            <span>Running this function asnwers of members is anonymous.</span>
          </div>
        </div>
      )}
    </button>
  )
}

export default memo(SwitchCheckBox)

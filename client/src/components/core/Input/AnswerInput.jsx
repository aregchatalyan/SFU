import React, { useRef, useEffect, memo } from 'react'
import { CustomButtonWithIcon } from '../Button'
import style from './style.module.scss'

const AnswerInput = ({
                       name,
                       value,
                       changeContext,
                       index,
                       canBeDelete,
                       isLastElement,
                     }) => {
  const lastVersion = useRef(null)
  useEffect(() => {
    if (lastVersion.current) {
      lastVersion.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
      })
    }
  }, [ lastVersion ])
  return (
    <div
      className={style.answerInputWrapper}
      ref={isLastElement ? lastVersion : null}
    >
      <input
        {...{ value, placeholder: 'Write your variant' }}
        onChange={({ target: { value } }) => {
          changeContext((state) => {
            const versions = state[name]
            versions[index].text = value
            return { ...state, [name]: versions }
          })
        }}
        className={style.answerInput}
      />
      {canBeDelete && (
        <CustomButtonWithIcon
          iconName="delete_version"
          width={24}
          height={24}
          className={style.deleteBtn}
          onClick={() =>
            changeContext((state) => {
              const versions = [ ...state[name] ]
              versions.splice(index, 1)
              return { ...state, versions }
            })
          }
        />
      )}
    </div>
  )
}

export default memo(AnswerInput)

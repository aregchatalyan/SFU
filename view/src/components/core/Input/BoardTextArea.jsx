import React, { memo, forwardRef, useState } from 'react'
import style from './style.module.scss'

export const BoardTextArea = memo(
  forwardRef(({ childRef }, ref) => {
    const [value, setValue] = useState('')

    return (
      <p className={style.board_text_area_wrapper} ref={ref}>
        <span
          ref={childRef}
          value={value}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
            } else if (e.key === 'Enter' && e.shiftKey) {
              setValue((value) => value + '\n')
            }
          }}
          onChange={({ target: { value } }) => {
            console.log('value', value)
            setValue(value)
          }}
          contentEditable
        />
      </p>
    )
  })
)

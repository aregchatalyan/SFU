import React, { memo } from 'react'

export { default as GradeInput } from './GradeInput'
export { BoardTextArea } from './BoardTextArea'

const CustomInput = ({
  className,
  inputValue,
  setInputValue,
  submit,
  placeholder,
}) => {
  return (
    <textarea
      value={inputValue}
      className={className}
      placeholder={placeholder}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          submit()
        } else if (e.key === 'Enter' && e.shiftKey) {
          e.preventDefault()
          setInputValue((value) => value + '\n')
        }
      }}
      onChange={({ target: { value } }) => setInputValue(value)}
      wrap="phisical"
    />
  )
}

export default memo(CustomInput)

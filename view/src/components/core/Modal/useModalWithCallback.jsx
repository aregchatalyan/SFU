import React, { useState } from 'react'
import CustomButton from '../Button'
import SubmitButton from '../Button/SubmitButton'
import style from './style.module.scss'

export const useModalWithCallback = () => {
  const [prevComment, setprevComment] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [submitModal, setSubmitModal] = useState({
    cb: () => {},
  })
  const callback = (setString, string = '') => {
    setIsModalOpened(true)
    setprevComment(string)
    setInputValue(string)
    setSubmitModal({
      cb: setString,
    })
  }
  const addComment = () => {
    if (prevComment !== inputValue && inputValue.length > 0) {
      submitModal.cb(inputValue)
      setIsModalOpened(false)
    }
  }

  const modal = (
    <div
      className={isModalOpened ? style.modalWrapper : style.modalWrapperHide}
    >
      <div className={style.commentModal}>
        <span className={style.title}>Add Comment</span>
        <div className={style.textAreaWrapper}>
          <textarea
            placeholder="Leave your comment here ..."
            maxLength={160}
            value={inputValue}
            onChange={({ target: { value } }) => setInputValue(value)}
          />
        </div>
        <div className={style.actionBar}>
          <CustomButton
            className={style.cancel}
            onClick={() => setIsModalOpened(false)}
            text="Cancel"
          />
          <SubmitButton
            text={prevComment.length > 0 ? 'Save' : 'Add Comment'}
            onClick={addComment}
            disabled={prevComment === inputValue || inputValue.length === 0}
          />
        </div>
      </div>
    </div>
  )

  return [modal, callback]
}

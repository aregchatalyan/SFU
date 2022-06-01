import React, { useState, useRef, memo } from 'react'
import { useOutsideClick } from '../../../hooks'
import Icon from '../Icon'
import style from './style.module.scss'

const CommentBox = ({ commentText, setCommentValue, openModal, editable }) => {
  return (
    <div className={style.commentBox}>
      <div className={style.commentWrapper}>
        {commentText}
        {editable && (
          <div className={style.actionBar}>
            <button
              className={style.editButton}
              onClick={() => openModal(setCommentValue, commentText)}
            >
              Edit
            </button>
            <button
              className={style.deleteButton}
              onClick={() => setCommentValue('')}
            >
              <Icon name="comment_delete" width={20} height={20}/>
            </button>
          </div>
        )}
      </div>
      <div className={style.pointer}/>
    </div>
  )
}

const GradeInput = ({ grade, isTeacher, comment, openModal }) => {
  const [ gradeValue, setGradeValue ] = useState('')
  const [ commentValue, setCommentValue ] = useState('')
  const inputRef = useRef(null)
  const { active: isFocused, setActive: setIsFocused } =
    useOutsideClick(inputRef)

  return (
    <>
      {isTeacher && grade !== 'A' ? (
        <>
          <div
            className={
              commentValue.length > 0
                ? style.commentBar
                : style.commentBarToWrite
            }
          >
            {commentValue.length > 0 && (
              <CommentBox
                commentText={commentValue}
                {...{ setCommentValue, openModal, editable: true }}
              />
            )}
            <button onClick={() => openModal(setCommentValue)}>
              <Icon name={'comment_log'} width={16} height={16}/>
            </button>
          </div>
          <div
            className={
              !gradeValue.length > 0
                ? style.inputWithoutGrade
                : isFocused
                  ? style.inputWithGradeFocused
                  : style.inputWithGrade
            }
          >
            <input
              type="tel"
              value={gradeValue}
              onChange={({ target: { value } }) => setGradeValue(value)}
              onFocus={() => {
                setIsFocused(true)
                inputRef.current.select()
              }}
              ref={inputRef}
            />
          </div>
        </>
      ) : (
        <>
          <span
            className={
              grade === 'A'
                ? style.absend
                : grade === 'P' || !grade
                  ? style.present
                  : style.grade
            }
          >
            {grade}
          </span>
          {comment && (
            <div className={style.commentBar}>
              <CommentBox commentText={comment}/>
              <Icon name={'comment_log'} width={16} height={16}/>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default memo(GradeInput)

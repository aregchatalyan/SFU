import React, { useState, useEffect, useContext } from 'react'
import SubmitButton from '../core/Button/SubmitButton'
import CustomButton from '../core/Button'
import AnswerInput from '../core/Input/AnswerInput'
import SwitchCheckBox from '../core/Input/SwitchCheckBox'
import TextArea from '../core/Input/TextArea'
import useModalWithButton from '../core/Modal'
import Icon from '../core/Icon'
import style from './style.module.scss'
import { SocketContext } from '../../Context'

const initialValues = {
  question: '',
  versions: [{ text: '' }, { text: '' }],
  anonymus: false,
}

const Children = ({ closeModal, selfId }) => {
  const socket = useContext(SocketContext)

  const [formContext, setFormContext] = useState({ ...initialValues })
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (formContext.question.length > 0) {
      setIsValid(true)
      formContext.versions.forEach(({ text }) => {
        setIsValid((state) => {
          if (state) {
            return text.length > 0
          } else {
            return state
          }
        })
      })
    } else {
      setIsValid(false)
    }
  }, [formContext])

  const addVersion = () => {
    const version = { text: '' }
    setFormContext((state) => {
      const versions = [...state.versions]
      versions.push(version)
      return { ...state, versions }
    })
  }

  return (
    <div className={style.pollContainer}>
      <div className={style.header}>
        <span>Create a Poll</span>
        <button
          onClick={closeModal}
          className={style.closeBtn}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="close_poll_modal" width={24} height={24} />
        </button>
      </div>
      <div className={style.createQuestion}>
        <span className={style.questionLabel}>Label</span>
        <TextArea
          name="question"
          className={style.questionInput}
          context={formContext}
          changeContext={setFormContext}
          placeholder="Have questions? Ask your friends"
        />
        <div className={style.versionHeader}>
          <span className={style.versionLabel}>Versions</span>
          <button
            className={style.addVersionBtn}
            onClick={addVersion}
            style={{ cursor: 'pointer' }}
          >
            <Icon name="poll_add_version" width={16} height={16} />
            <span>Add Version</span>
          </button>
        </div>
        <div
          className={
            formContext.versions.length > 3
              ? style.versionsContainer
              : style.versionsContainerSmall
          }
        >
          {formContext.versions.map(({ text: value }, index, arr) => (
            <AnswerInput
              {...{
                name: 'versions',
                value,
                index,
                canBeDelete: formContext.versions.length > 2,
                changeContext: setFormContext,
                isLastElement: index === arr.length - 1,
              }}
              key={index}
            />
          ))}
        </div>
        <SwitchCheckBox
          {...{
            name: 'anonymus',
            context: formContext,
            setContext: setFormContext,
            label: 'Anonymus Poll',
          }}
        />
        <div className={style.actionBar}>
          <CustomButton
            text={'Cancel'}
            onClick={() => {
              closeModal()
              setFormContext({
                question: '',
                versions: [{ text: '' }, { text: '' }],
                anonymus: false,
              })
            }}
            className={style.cancelButton}
          />
          <SubmitButton
            text="Publish Survey"
            disabled={!isValid}
            onClick={() => {
              socket.emit('createPoll', {
                userId: selfId,
                ...formContext,
              })
              setFormContext({
                question: '',
                versions: [{ text: '' }, { text: '' }],
                anonymus: false,
              })
              closeModal()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export const useCreatePollModal = ({ selfId }) =>
  useModalWithButton({
    child: ({ closeModal }) => <Children {...{ closeModal, selfId }} />,
    modalProps: {
      className: style.createPollModalContainer,
    },
    buttonProps: {
      children: (
        <>
          <Icon name="create_poll" width={21} height={20} />
          <span>Create</span>
        </>
      ),
      className: style.buttonStyle,
    },
  })

import React, { useState, memo, useMemo, useContext } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { RoomInfoContext } from '../../../Context'
import Answer from './answer'
import Icon from '../Icon'
import defaultUser from '../../../assets/img/defaultUser.png'
import style from './style.module.scss'
import { TimeAgo } from '../../../helpers'

const Question = ({
  question,
  versions,
  isAnswered,
  onVersionSelect,
  anonymous,
  creatorId,
  createdAt,
}) => {
  const [isOpened, setIsOpened] = useState(false)
  const variantContainer = useMemo(
    () => ({
      initial: {
        height: 0,
        opacity: 0,
      },
      visible: {
        height: 'auto',
        opacity: 1,
        transition: {
          duration: 0.2,
          type: 'easeInOut',
          delayChildren: 0.2,
        },
      },
    }),
    []
  )
  const variantList = useMemo(
    () => ({
      show: {
        transition: {
          delayChildren: 0.1,
          staggerChildren: 0.05,
          ease: 'easeInOut',
        },
      },
    }),
    []
  )
  const questionController = useAnimation()
  const iconController = useAnimation()
  const { getUserById } = useContext(RoomInfoContext)
  const { name, surname } = getUserById(creatorId || '') || {
    name: '',
    surname: '',
  }

  return (
    <div className={style.questionWrapper}>
      <motion.button
        className={style.questionComponent}
        onClick={() => {
          setIsOpened(!isOpened)
          questionController.start({
            height: !isOpened ? 'auto' : '24px',
            transition: {
              duration: 0.2,
              type: 'easyInOut',
            },
          })
          iconController.start({
            rotate: isOpened ? 0 : -90,
          })
        }}
      >
        <div className={style.infoContainer}>
          <div className={style.userInfoContainer}>
            <div>
              <img src={defaultUser} alt="" />
            </div>
            <span>{`${name} ${surname}`}</span>
          </div>
          <motion.div
            animate={questionController}
            className={style.questionContainer}
          >
            <span>{question}</span>
            {question.length > 83 && !isOpened && <span>...</span>}
          </motion.div>
          <div className={style.dateContainer} animate={iconController}>
            <span>Created in : {TimeAgo(createdAt)}</span>
          </div>
        </div>
        <motion.div className={style.iconContainer} animate={iconController}>
          <Icon name="open_variant" width={24} height={24} />
        </motion.div>
      </motion.button>
      <AnimatePresence exitBeforeEnter>
        {isOpened && (
          <motion.div
            className={style.answerBar}
            variants={variantContainer}
            initial="initial"
            animate="visible"
            exit="initial"
          >
            <motion.ul
              className="users_wrapper"
              variants={variantList}
              animate="show"
              initial="hidden"
              exit="hidden"
            >
              {versions.map(
                ({ id, text: label, isVoted, percentage, votes }, key) => (
                  <Answer
                    key={key}
                    {...{
                      isAnswered,
                      label,
                      isVoted,
                      percentage,
                      anonymous,
                      onSelect: onVersionSelect(id),
                      votes,
                    }}
                  />
                )
              )}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(Question)

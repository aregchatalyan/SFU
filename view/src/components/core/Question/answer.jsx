import React, { memo, useMemo } from 'react'
import CheckBox from '../Input/CheckBox'
import user from '../../../assets/img/user1.png'
import style from './style.module.scss'
import { motion } from 'framer-motion'

const Answer = ({
  isVoted,
  isAnswered,
  label,
  percentage,
  onSelect,
  anonymus,
  votes,
}) => {
  const variantItem = useMemo(
    () => ({
      hidden: { y: -40, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
      },
      exit: { opacity: 0 },
    }),
    []
  )
  return (
    <motion.li className={style.answerWrapper} variants={variantItem}>
      <div className={style.answerContainer}>
        {isAnswered ? (
          isVoted ? (
            <CheckBox {...{ label, checked: isVoted, disable: true }} />
          ) : (
            <span className={style.answerText}>{label}</span>
          )
        ) : (
          <CheckBox {...{ label, onSelect }} />
        )}
        {isAnswered && (
          <motion.div
            className={style.percentageLine}
            initial={{
              width: 0,
              transition: {
                duration: 1,
              },
            }}
            animate={{
              width: `${percentage}%`,
              transition: {
                duration: 1,
              },
            }}
          />
        )}
        {isAnswered && (
          <div className={style.percentage}>
            <span>{`${percentage} %`}</span>
          </div>
        )}
      </div>
      <div
        className={isAnswered && !anonymus ? style.votesOpen : style.votesHide}
      >
        <span>Voters :</span>
        <div className={style.votersWrapper}>
          {!anonymus && votes && votes.length > 0 ? (
            votes.map((id, key) => (
              <div key={key} className={style.voterImg}>
                <img src={user} alt="" />
              </div>
            ))
          ) : (
            <span>0</span>
          )}
        </div>
      </div>
    </motion.li>
  )
}

export default memo(Answer)

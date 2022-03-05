import React, { useRef, memo } from 'react'
import style from './style.module.scss'
import MassageConatiner from './MassageContainer'
import { useEffect } from 'react'

const Chat = ({ userId, massages }) => {
  const containerRef = useRef(null)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - containerRef.current.clientHeight
    }
  }, [containerRef, massages])
  return (
    <div className={style.msgContainer} ref={containerRef}>
      {massages.map(({ text, userId: msgWriter }, key) => {
        return (
          <MassageConatiner
            {...{ text, isMine: msgWriter === userId }}
            key={key}
          />
        )
      })}
    </div>
  )
}

export default memo(Chat)

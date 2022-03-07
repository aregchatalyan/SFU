import React, { useContext, useEffect } from 'react'
import pencil from '../../assets/img/pencil.png'
import { SocketContext } from '../../Context'
import { BoardTextArea } from '../core/Input'

const WhiteBoard = ({
  savedBoardRef,
  boardRef,
  identyfierRef,
  editorName,
  toolType,
  textAreaRef,
  spanRef,
  texts,
}) => {
  const socket = useContext(SocketContext)

  useEffect(() => {
    socket.emit('getBoardData')
  }, [socket])

  return (
    <div
      className="whiteBoardWrapper"
      width={window.innerWidth}
      height={window.innerHeight}
    >
      <div className="user_identifyer" ref={identyfierRef}>
        <img src={pencil} alt="" />
        <span id="user_name_wrapper" className="user_name">
          {editorName}
        </span>
      </div>
      <BoardTextArea childRef={spanRef} ref={textAreaRef} />
      <canvas
        className="wrappercanvas"
        style={{
          backgroundColor: '#F3F2EF',
        }}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={savedBoardRef}
      >
        Canvas
      </canvas>
      {texts.map(
        (
          {
            text,
            left,
            top,
            maxWidth,
            fontSize,
            lineHeight,
            color,
            canvasWidth,
            canvasHeight,
            ...otherProps
          },
          index
        ) => {
          const scaleWidth = window.innerWidth / canvasWidth
          const scaleHeight = window.innerHeight / canvasHeight
          console.log('first', otherProps)
          return (
            <span
              className="text_wrapper"
              style={{
                left: left * scaleWidth + 'px',
                top: top * scaleHeight + 'px',
                maxWidth: maxWidth + 'px',
                fontSize: fontSize + 'px',
                lineHeight: lineHeight + 'px',
                color,
              }}
              key={index}
            >
              {text}
            </span>
          )
        }
      )}

      <canvas
        className={`wrappercanvas cursor_${toolType}`}
        style={{
          backgroundColor: 'none',
        }}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={boardRef}
      >
        Canvas
      </canvas>
    </div>
  )
}

export default WhiteBoard

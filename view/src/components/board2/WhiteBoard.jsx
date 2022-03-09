import React, { useContext, useEffect } from 'react'
import pencil from '../../assets/img/cursor/pencil.png'
import traiangle from '../../assets/img/cursor/traiangle.png'
import circle from '../../assets/img/cursor/circle.png'
import rectangle from '../../assets/img/cursor/rectangle.png'
import line from '../../assets/img/cursor/line.png'
import pointer from '../../assets/img/cursor/pointer.png'
import { SocketContext } from '../../Context'
import { BoardTextArea } from '../core/Input'

const imgs = {
  triangle: traiangle,
  rectangle: rectangle,
  circle: circle,
  pencil: pencil,
  line: line,
  pointer: pointer,
}

const WhiteBoard = ({
  savedBoardRef,
  boardRef,
  identyfierRef,
  editorName,
  editorToolType,
  toolType,
  textAreaRef,
  spanRef,
  texts,
  permissionToEdit,
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
      <div
        className={
          editorToolType === 'pencil'
            ? 'user_identifyer'
            : 'user_identifyer_inside'
        }
        ref={identyfierRef}
      >
        <img src={imgs[editorToolType]} alt="" />
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
        className={`wrappercanvas cursor_${permissionToEdit && toolType}`}
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

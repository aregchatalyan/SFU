import React, { useState } from 'react'
import './theme/toolBoard.scss'
import {
  Line,
  Resize,
  Triangle,
  Rectangle,
  Circle,
  Fill,
  Pencil,
  Eraser,
  Reset,
  Text,
  Pointer,
  VideoCall,
  Undo,
  Redo,
  Divider,
  Size,
} from './theme/svg'
import ColourPicker from './ColourPicker'
import { FontWeight } from './FontWeight'

export default function ToolBoard({
  toolType,
  setToolType,
  width,
  setWidth,
  setColorWidth,
  colorWidth,
  setShapeWidth,
  goToVideoCall,
  order,
  undo,
  hash,
  redo,
  reset,
}) {
  const [displayStroke, setDisplayStroke] = useState(false)
  const [prevTool, setPrevTool] = useState('pencil')

  const handleClickStroke = () => {
    setDisplayStroke(!displayStroke)
    setColorWidth(colorWidth)
  }

  return (
    <div>
      <div className="header">
        <div className="tools">
          <button
            id="videocall"
            data-toggle="tooltip"
            data-placement="top"
            title="Back to videocall"
            className="videoCallBtn"
            onClick={goToVideoCall}
          >
            <VideoCall toolType={toolType} colorWidth={colorWidth} />
          </button>
          <button
            id="triangle"
            data-toggle="tooltip"
            data-placement="top"
            title="Triangle"
            className={`topicons ${toolType === 'triangle' ? 'active' : ''}`}
            onClick={() => {
              setToolType('triangle')
              setWidth(1)
              setShapeWidth(1)
            }}
          >
            <Triangle toolType={toolType} colorWidth={colorWidth} />
          </button>
          <button
            id="rectangle"
            data-toggle="tooltip"
            data-placement="top"
            title="Rectangle"
            className={`topicons ${toolType === 'rectangle' ? 'active' : ''}`}
            onClick={() => {
              setToolType('rectangle')
              setWidth(1)
              setShapeWidth(1)
            }}
          >
            <Rectangle toolType={toolType} colorWidth={colorWidth} />
          </button>
          <button
            id="circle"
            data-toggle="tooltip"
            data-placement="top"
            title="Circle"
            className={`topicons ${toolType === 'circle' ? 'active' : ''}`}
            onClick={() => {
              setToolType('circle')
              setWidth(1)
              setShapeWidth(1)
            }}
          >
            <Circle toolType={toolType} colorWidth={colorWidth} />
          </button>
          <button
            id="pencil"
            data-toggle="tooltip"
            data-placement="top"
            title="Pencil"
            className={`topicons ${toolType === 'pencil' ? 'active' : ''}`}
            onClick={() => {
              setToolType('pencil')
              setWidth(1)
              setShapeWidth(1)
            }}
          >
            <Pencil toolType={toolType} colorWidth={colorWidth} />
          </button>
          <button
            id="line"
            data-toggle="tooltip"
            data-placement="top"
            title="Line"
            className={`topicons ${toolType === 'line' ? 'active' : ''}`}
            onClick={() => {
              setToolType('line')
              setWidth(1)
              setShapeWidth(1)
            }}
          >
            <Line toolType={toolType} colorWidth={colorWidth} />
          </button>
          <button
            id="text"
            data-toggle="tooltip"
            data-placement="top"
            title="Text"
            className={`topicons ${toolType === 'text' ? 'active' : ''}`}
            onClick={() => {
              setToolType('text')
              setShapeWidth(1)
            }}
          >
            <Text toolType={toolType} colorWidth={colorWidth} />
          </button>
          <button
            id="selection"
            data-toggle="tooltip"
            data-placement="top"
            title="Selection"
            className={`topicons ${toolType === 'selection' ? 'active' : ''}`}
            onClick={() => {
              setToolType('selection')
              setShapeWidth(1)
            }}
          >
            <Resize toolType={toolType} colorWidth={colorWidth} />
          </button>
          <button
            id="pointer"
            data-toggle="tooltip"
            data-placement="top"
            title="Pointer"
            className={`topicons ${toolType === 'pointer' ? 'active' : ''}`}
            onClick={() => {
              setToolType('pointer')
            }}
          >
            <Pointer toolType={toolType} />
          </button>
        </div>
        <div className="title">
          <h1 className="titleText">Blackboard</h1>
        </div>
        <div className="extraTools">
          <div className="backAhed">
            <button
              id="eraser"
              data-toggle="tooltip"
              data-placement="top"
              title="Eraser"
              className={`topicons ${toolType === 'eraser' ? 'active' : ''}`}
              onClick={() => {
                setToolType('eraser')
                setWidth(10)
                setShapeWidth(1)
              }}
            >
              <Eraser toolType={toolType} colorWidth={colorWidth} />
            </button>
            <button
              className={`largIcon  ${
                toolType === 'fontWeight' ? 'active' : ''
              }`}
              onClick={() => {
                setPrevTool(toolType)
                setToolType('fontWeight')
              }}
            >
              <Size toolType={toolType} />

              {toolType === 'fontWeight' ? (
                <FontWeight
                  method={setWidth}
                  setTooltype={setToolType}
                  prevToolType={prevTool}
                />
              ) : null}
            </button>

            <button className="refreshIcon" onClick={handleClickStroke}>
              <Fill />
            </button>
          </div>
          <Divider />
          <div className="backAhed">
            <button
              id="undo"
              data-toggle="tooltip"
              data-placement="top"
              title="Undo"
              className="refreshIcon"
              onClick={undo}
            >
              <Undo enabled={order.length > 0} />
            </button>
            <button
              className="refreshIcon"
              data-toggle="tooltip"
              data-placement="top"
              title="Clear"
              onClick={reset}
            >
              <Reset />
            </button>

            <button
              id="redo"
              data-toggle="tooltip"
              data-placement="top"
              title="Redo"
              className="refreshIcon"
              onClick={redo}
            >
              <Redo enabled={hash.length > 0} />
            </button>
          </div>
          <Divider />
        </div>
      </div>
      {displayStroke && <ColourPicker setColorWidth={setColorWidth} />}
    </div>
  )
}

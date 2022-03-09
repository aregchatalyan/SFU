import React, { useRef, useState, useContext } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useColor } from 'react-color-palette'
import ColorPicker from '../core/ColorPicker'
import Header from './header'
import ManageDropdown from './manageDropdown'
import useBoardAction from './useBoardAction'
import WhiteBoard from './WhiteBoard'
import { RoomInfoContext } from '../../Context'

const Board = ({ className, goToVideoCall, selfId, handleFullScreen }) => {
  const { isTeacher, boardPermission, getUserById } =
    useContext(RoomInfoContext)
  const [permissionToEdit, setPermissionToEdit] = useState(
    isTeacher || boardPermission
  )
  const [toolType, setToolType] = useState('pencil')
  const [color, setColor] = useColor('hex', '#1c1d1f')
  const [selectColor, setSelectColor] = useState(false)
  const [editorName, setEditorName] = useState('')
  const [editorToolType, setEditorToolType] = useState('pencil')
  const [texts, setTexts] = useState([])

  const [width, setWidth] = useState({ element: 2, path: 1 })

  const savedBoardRef = useRef(null)
  const boardRef = useRef(null)
  const identyfierRef = useRef(null)
  const textAreaRef = useRef(null)
  const spanRef = useRef(null)

  const boardProps = useBoardAction({
    boardRef,
    savedBoardRef,
    toolType,
    color,
    width,
    selfId,
    permissionToEdit,
    identyfierRef,
    setEditorName,
    setEditorToolType,
    getUserById,
    textAreaRef,
    spanRef,
    setTexts,
  })

  return (
    <div className={className} style={{ backgroundColor: 'white' }}>
      <Header
        {...{
          toolType,
          setToolType,
          color,
          goToVideoCall,
          width,
          setWidth,
          handleFullScreen,
          setSelectColor,
          permissionToEdit,
          setPermissionToEdit,
          selfId,
          ...boardProps,
        }}
      />
      <WhiteBoard
        {...{
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
        }}
      />
      <AnimatePresence exitBeforeEnter>
        {selectColor && (
          <ColorPicker className="color_picker" {...{ color, setColor }} />
        )}
      </AnimatePresence>

      {isTeacher && <ManageDropdown {...{ selfId }} />}
    </div>
  )
}

export default Board

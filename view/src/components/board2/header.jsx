import { AnimatePresence, motion } from 'framer-motion'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { RoomInfoContext } from '../../Context/roomInfoContext'
import CustomButton, {
  ButtonWithTextAndIcon,
  CustomButtonWithIcon,
  LoadingButton,
  ToolButton,
} from '../core/Button'
import Icon from '../core/Icon'
import './style.scss'

const tools = [
  'triangle',
  'rectangle',
  'circle',
  'pencil',
  'line',
  'text',
  'move',
  'pointer',
]
const widths = [
  {
    title: '1px',
    width: { path: 1, element: 2, fontSize: 16, lineHeight: 24 },
  },
  {
    title: '2px',
    width: { path: 2, element: 3, fontSize: 20, lineHeight: 30 },
  },
  {
    title: '3px',
    width: { path: 3, element: 4, fontSize: 24, lineHeight: 32 },
  },
  {
    title: '4px',
    width: { path: 4, element: 5, fontSize: 28, lineHeight: 40 },
  },
  {
    title: '5px',
    width: { path: 5, element: 6, fontSize: 32, lineHeight: 48 },
  },
]

const DropdownMenu = ({ width, setWidth }) => {
  const [isFontDropdownOpened, setIsFontDropdownOpened] = useState(false)

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
  const variantItem = useMemo(
    () => ({
      hidden: { y: -25, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
      },
      exit: { opacity: 0 },
    }),
    []
  )
  const varinatContainer = useMemo(
    () => ({
      initial: {
        height: 0,
        opacity: 0,
        transition: {
          duration: 0.1,
          type: 'easeInOut',
        },
      },
      visible: {
        height: 216,
        opacity: 1,
        transition: {
          duration: 0.1,
          type: 'easeInOut',
        },
      },
    }),
    []
  )

  return (
    <div className="button_dropdown">
      <CustomButtonWithIcon
        iconName="board_select_width"
        width={48}
        height={20}
        className="select_font"
        onClick={() => setIsFontDropdownOpened((state) => !state)}
      />
      <AnimatePresence>
        {isFontDropdownOpened && (
          <motion.div
            className={'dropdown_menu'}
            variants={varinatContainer}
            initial="initial"
            animate="visible"
            exit="initial"
          >
            <motion.ul
              variants={variantList}
              animate="show"
              initial="hidden"
              exit="hidden"
            >
              {widths.map(({ title, width: insertWidth }, index) => (
                <motion.li
                  variants={variantItem}
                  className={`dopdown_menu_item ${
                    insertWidth.path === width.path && 'active_font'
                  }`}
                  onClick={() => {
                    setIsFontDropdownOpened(false)
                    setWidth(insertWidth)
                  }}
                  key={index}
                >
                  <span className="pixel_icon" />
                  <span className="pixel_title">{title}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Header = ({
  toolType,
  setToolType,
  goToVideoCall,
  width,
  setWidth,
  handleFullScreen,
  reset,
  undo,
  undoDisabled,
  redo,
  redoDisabled,
  color,
  setSelectColor,
  permissionToEdit,
  setPermissionToEdit,
  socket,
  selfId,
}) => {
  const [isPermissionReqLoading, setIsPermissionReqLoading] = useState(false)
  const { isTeacherJoind } = useContext(RoomInfoContext)

  const askPermission = useCallback(() => {
    setIsPermissionReqLoading(true)
    socket.emit('askPermission', { userId: selfId })
  }, [socket, selfId])
  useEffect(() => {
    socket.on('myBoardPermission', (data) => {
      setPermissionToEdit(data.allowed)
      setIsPermissionReqLoading(false)
    })
  }, [socket, setPermissionToEdit])
  return (
    <div className="header">
      <ButtonWithTextAndIcon
        className="goBackBtn"
        onClick={goToVideoCall}
        iconName="go_to_videocall"
        text="VideoCall"
      />
      <div className="tools">
        {permissionToEdit ? (
          tools.map((type, index) => (
            <ToolButton key={index} {...{ type, toolType, setToolType }} />
          ))
        ) : (
          <span className="permission_denied_text">
            You don’t have permission to join blackboard
          </span>
        )}
      </div>
      <div className="title">
        <h1 className="titleText">Blackboard</h1>
      </div>
      <div className="extra_tools">
        {permissionToEdit && <DropdownMenu {...{ width, setWidth }} />}
        {permissionToEdit && (
          <CustomButton
            className={'color_select'}
            onClick={() => setSelectColor((state) => !state)}
          >
            {color.hex === '#1c1d1f' ? (
              <Icon name="board_color_circle" width={20} height={20} />
            ) : (
              <div
                className="color_wrapper"
                style={{ backgroundColor: color.hex }}
              />
            )}
          </CustomButton>
        )}

        {permissionToEdit && (
          <Icon name="board_divider" width={1} height={40} />
        )}
        {permissionToEdit ? (
          <div className="reset_undo_redo">
            <CustomButtonWithIcon
              iconName="board_undo"
              width={20}
              height={20}
              className={`undo_redo ${!undoDisabled && 'active'}`}
              onClick={undo}
            />
            <CustomButtonWithIcon
              iconName="board_reset"
              width={16}
              height={16}
              onClick={reset}
              className="reset"
            />
            <CustomButtonWithIcon
              iconName="board_redo"
              width={20}
              height={20}
              className={`undo_redo ${!redoDisabled && 'active'}`}
              onClick={redo}
            />
          </div>
        ) : isTeacherJoind ? (
          <LoadingButton
            iconName="board_ask_permission"
            text="Ask to edit"
            loadingText="Asking ..."
            loading={isPermissionReqLoading}
            onClick={askPermission}
          />
        ) : null}
        {permissionToEdit && (
          <Icon name="board_divider" width={1} height={40} />
        )}
        <CustomButtonWithIcon
          iconName="full_screen"
          width={20}
          height={20}
          onClick={handleFullScreen}
          className="full_screen_btn"
        />
      </div>
    </div>
  )
}

export default Header

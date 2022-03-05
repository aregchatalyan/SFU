import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import Icon from '../Icon'
import { fadeIn } from '../../../helpers/animation.helpers'
import './style.scss'
import { DimensionsContext } from '../../../Context'
import { CustomButtonWithIcon } from '../Button'
import { useResizeObserver } from '../../../hooks'

const DragbleVideo = ({
  id,
  stream,
  onClick,
  audioConsumerId,
  audioStream,
  showMicState,
  myMicOn,
  name,
  surname,
  appRef,
  isUserListOpened,
  ...otherProps
}) => {
  const controller = useAnimation()
  const userVideo = useRef()
  const dragRef = useRef()
  const { width, height } = useContext(DimensionsContext)
  const [isSmalled, setIsSmalled] = useState(false)
  const [position, setPosition] = useState({
    horizontal: width - 360,
    vertical: height - 240,
  })
  const [isPositionChanged, setIsPositionChanged] = useState(false)

  const [appRectWidth, appRectHeight] = useResizeObserver(appRef)

  useLayoutEffect(() => {
    if (isUserListOpened || isPositionChanged) {
      setIsPositionChanged(true)
      if (position.horizontal > 0) {
        controller.start({
          x: appRectWidth - 360,
        })
      }
      if (position.vertical > 0) {
        controller.start({
          y: appRectHeight - 240,
        })
      }
    }
  }, [appRectWidth, appRectHeight, controller]) // eslint-disable-line

  const dragEnd = useCallback(
    ({ x: targetX, y: targetY }) => {
      let x, y
      if (appRef.current && dragRef.current) {
        const appRect = appRef.current.getBoundingClientRect()
        const pipRect = dragRef.current.getBoundingClientRect()
        const pipMiddleX = pipRect.width / 2
        const pipMiddleY = pipRect.height / 2
        if (targetX + pipMiddleX > appRect.width / 2) {
          x = appRect.width - 360
        } else {
          x = 0
        }
        if (targetY + pipMiddleY > appRect.height / 2) {
          y = appRect.height - 240
        } else {
          y = 0
        }
        setPosition({
          horizontal: x,
          vertical: y,
        })
        setIsPositionChanged(true)
        controller.start({
          x,
          y,
        })
      }
    },
    [appRef, dragRef, controller]
  )

  useEffect(() => {
    if (userVideo.current) userVideo.current.srcObject = stream
  }, [stream, isSmalled])

  const handleResize = () => {
    setIsSmalled(!isSmalled)
  }

  return (
    <motion.div
      className="dragbleVideoContainerWrapper"
      drag
      dragConstraints={appRef}
      animate={controller}
      initial={{ x: width - 360, y: height - 240 }}
      ref={dragRef}
      layout
      dragElastic={0.1}
      {...otherProps}
      whileTap={{
        cursor: 'grabbing',
        scale: 1.05,
      }}
      onDragEnd={dragEnd}
    >
      <div
        className={
          isSmalled ? 'dragbleVideoContainerSmalled' : 'dragbleVideoContainer'
        }
        style={
          isSmalled
            ? {
                top: position.vertical === 0 ? '20px' : '164px',
                left: position.horizontal === 0 ? '20px' : '284px',
              }
            : {}
        }
      >
        <AnimatePresence exitBeforeEnter>
          {stream && !isSmalled ? (
            <motion.video
              initial={fadeIn.hidden}
              animate={fadeIn.visible}
              exit={fadeIn.hidden}
              id={id}
              playsInline={false}
              autoPlay={true}
              ref={userVideo}
              muted
              className="video"
            />
          ) : (
            <motion.div
              initial={fadeIn.hidden}
              animate={fadeIn.visible}
              exit={fadeIn.hidden}
              className="placholder"
            >
              <Icon name="vidowrapper_user_small" width={64} height={64} />
              <span className="name">{`${name} ${surname}`}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <CustomButtonWithIcon
          iconName="resize_dragalbe"
          className="resize_btn"
          width={20}
          height={20}
          onClick={handleResize}
        />
      </div>
    </motion.div>
  )
}

export default DragbleVideo

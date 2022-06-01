import React, { useRef, memo } from 'react'
import { useEffect } from 'react'
import { useComponentHover } from '../../../../hooks/useComponenetHover'
import Icon from '../../Icon'
import style from './style.module.scss'

const CircleButtonWithHover = ({
                                 onClick,
                                 iconName,
                                 children,
                                 state,
                                 handlFix,
                                 isChatFixed,
                                 showLocker,
                                 opened,
                                 closed,
                                 locked,
                                 unLocked,
                                 isOpenDenied,
                                 setisSubBarOpened,
                                 newNotification,
                               }) => {
  const hoverRef = useRef(null)
  const [ isHovered, setIsHovered ] = useComponentHover(hoverRef)

  useEffect(
    () => setisSubBarOpened && setisSubBarOpened(isHovered),
    [ isHovered, setisSubBarOpened ]
  )

  return (
    <div ref={hoverRef} onClick={() => setIsHovered(false)}>
      <div className={(isHovered || state) && !isOpenDenied ? opened : closed}>
        {children}
        {showLocker && (
          <button
            className={isChatFixed ? locked : unLocked}
            onClick={handlFix}
            style={{ cursor: 'pointer' }}
          >
            <Icon
              name={isChatFixed ? 'massagebar_locked' : 'massagebar_lock'}
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
      <button
        onClick={onClick}
        style={{ cursor: 'pointer' }}
        className={
          isHovered || state
            ? style.circleButtonWithHoverActive
            : style.circleButtonWithHover
        }
      >
        <Icon name={iconName} width={24} height={24}/>
        <Icon
          name="notification_circle"
          width={12}
          height={12}
          className={
            newNotification ? style.notification : style.notificationHide
          }
        />
      </button>
    </div>
  )
}

export default memo(CircleButtonWithHover)

import React, { useMemo, useState, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CustomButton from '../core/Button'
import Icon from '../core/Icon'
import SwitchCheckBox from '../core/Input/SwitchCheckBox'
import { UserInfoContext } from '../../Context'
import { RoomInfoContext } from '../../Context/roomInfoContext'

const UserWrapper = ({ userId, name, surname }) => {
  const { getUserBoardPermission, changeUserBoardPermission } =
    useContext(RoomInfoContext)

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
    <motion.li className="user_wrapper" variants={variantItem}>
      <div className="img_and_name">
        <div className="img_wrapper">
          <Icon name="default_profile_mega_small" width={24} height={24} />
        </div>
        <span className="user_name">{`${name} ${surname}`}</span>
      </div>
      <SwitchCheckBox
        {...{
          state: getUserBoardPermission(userId),
          callBack: (allowed) => changeUserBoardPermission({ userId, allowed }),
        }}
      />
    </motion.li>
  )
}

const ManageDropdown = ({ selfId }) => {
  const [isDropDownOpened, setIsDropDownOpened] = useState(false)
  const { users, getUserBoardPermission } = useContext(UserInfoContext)

  const varinatContainer = useMemo(
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

  return (
    <div className="user_manage_wrapper">
      <CustomButton
        className={`user_manage_button ${isDropDownOpened && 'opened'}`}
        onClick={() => setIsDropDownOpened((prev) => !prev)}
      >
        <div className="icon_text_wrapper">
          <Icon name="board_manage_user" width={16} height={16} />
          <span>Manage Users</span>
        </div>
        <div className="arrow">
          <Icon name="board_manage_user_arrow" width={16} height={16} />
        </div>
      </CustomButton>
      <AnimatePresence exitBeforeEnter>
        {isDropDownOpened && (
          <motion.div
            variants={varinatContainer}
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
              {users.length > 1 ? (
                users.map(
                  (elm, index) =>
                    elm.userId !== selfId && (
                      <UserWrapper
                        {...{ ...elm, getUserBoardPermission }}
                        key={index}
                      />
                    )
                )
              ) : (
                <span className="empty_msg">Nobody is joined yet</span>
              )}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageDropdown

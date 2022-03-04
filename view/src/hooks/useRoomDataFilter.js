import { useCallback, useEffect, useState } from 'react'

export const useRoomDataFilter = (userId, socket) => {
  const [roomData, setRoomData] = useState(undefined)
  const setRoomDataFunc = (data) => {
    const { users, isTeacher, teacherInfo, ...otherProps } = data

    const me = isTeacher
      ? teacherInfo
      : users.filter(({ id }) => id === userId)[0]
    const classmates = users.filter(({ id }) => id !== userId)
    setRoomData({ me, classmates, isTeacher, teacherInfo, ...otherProps })
  }
  const getUserById = (userId) => {
    const userData =
      roomData && roomData.teacherInfo.id === userId
        ? roomData.teacherInfo
        : roomData &&
          [roomData.me, ...roomData.classmates].filter(
            ({ id }) => id === userId
          )[0]
    return {
      name: userData.name,
      surname: userData.surname,
    }
  }
  const changeUserBoardPermission = useCallback(
    ({ userId: studentId, allowed }) => {
      socket.emit('handlePermission', {
        studentId,
        userId,
        allowed,
      })

      setRoomData((state) => {
        const users = [...state.classmates].map(({ id, ...otherProps }) => {
          return id === studentId
            ? { id, ...otherProps, boardPermission: allowed }
            : { id, ...otherProps }
        })
        const stateCopy = { ...state, classmates: users }
        return stateCopy
      })
    },
    [socket, userId]
  )
  const getUserBoardPermission = useCallback(
    (userId) => {
      const userData =
        roomData && roomData.teacherInfo.id === userId
          ? roomData.teacherInfo
          : roomData &&
            [roomData.me, ...roomData.classmates].filter(
              ({ id }) => id === userId
            )[0]
      return userData.boardPermission
    },
    [roomData]
  )
  useEffect(() => {
    socket &&
      socket.on('teacherJoin', ({ joined }) => {
        setRoomData((state) => ({ ...state, isTeacherJoind: joined }))
      })
  }, [socket])

  return [
    roomData,
    setRoomDataFunc,
    getUserById,
    changeUserBoardPermission,
    getUserBoardPermission,
  ]
}

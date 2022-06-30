import { useCallback, useEffect, useState } from 'react'

export const useRoomDataFilter = (userId, socket) => {
  const [ roomData, setRoomData ] = useState(undefined)
  const [ isLoading, setIsLoading ] = useState(true)

  const setRoomDataFunc = useCallback(
    (data) => {
      const { students, isTeacher, teacher, ...otherProps } = data

      const me = isTeacher
        ? teacher
        : students.filter(({ id }) => +id === userId)[0]

      const classmates = students.filter(({ id }) => id !== userId)

      setRoomData({ me, classmates, isTeacher, teacher, ...otherProps })
    }, [ userId ])

  useEffect(() => {
    socket &&
    socket.on('connected', (data) => {
      setIsLoading(false)
      setRoomDataFunc(data)
    })
  }, [ socket, setRoomDataFunc ])

  const getUserById = useCallback((userId) => {
    const userData = roomData && +roomData.teacher.id === userId
      ? { isTeacher: true, ...roomData.teacher }
      : roomData && [ roomData.me, ...roomData.classmates ]
      .filter(({ id }) => +id === userId)[0]

    return {
      name: userData.name,
      surname: userData.surname,
      isTeacher: userData.isTeacher || false,
    }
  }, [ roomData ])

  const changeUserBoardPermission = useCallback(
    ({ userId: studentId, allowed }) => {
      socket.emit('handlePermission', {
        studentId,
        userId,
        allowed,
      })

      setRoomData((state) => {
        const users = [ ...state.classmates ].map(({ id, ...otherProps }) => {
          return id === studentId
            ? { id, ...otherProps, boardPermission: allowed }
            : { id, ...otherProps }
        })
        return { ...state, classmates: users }
      })
    }, [ socket, userId ])

  const getUserBoardPermission = useCallback(
    (userId) => {
      const userData =
        roomData && +roomData.teacher.id === userId
          ? roomData.teacher
          : roomData &&
          [ roomData.me, ...roomData.classmates ].filter(
            ({ id }) => +id === userId
          )[0]
      return userData.boardPermission
    }, [ roomData ])

  useEffect(() => {
    socket &&
    socket.on('teacherJoin', ({ joined }) => {
      setRoomData((state) => ({ ...state, isTeacherJoind: joined }))
    })
  }, [ socket ])

  return [
    isLoading,
    roomData,
    getUserById,
    changeUserBoardPermission,
    getUserBoardPermission,
  ]
}

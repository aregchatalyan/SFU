import io from 'socket.io-client'
import { URL } from '../config'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRoomDataFilter, useProducerChange } from './notExported'
import { useSocketInit } from './notExported/useSocketInit'

export const useStateChange = () => {
  const [users, setUsers] = useState([])
  const [disconnectedUsers, setDisconnectedUsers] = useState([])

  const socket = useRef(undefined)
  const { userId, roomId } = useParams()
  useEffect(() => {
    socket.current = io(URL + `?room_id=${roomId}&user_id=${userId}`, {
      secure: true,
    })
  }, [roomId, socket, userId])

  const [
    isLoading,
    roomData,
    getUserById,
    changeUserBoardPermission,
    getUserBoardPermission,
  ] = useRoomDataFilter(userId, socket.current)

  const { setUserList, setProducers } = useProducerChange(
    socket.current,
    setUsers,
    roomData
  )
  const statesChangeWithSocket = useSocketInit({
    socket: socket.current,
    setUserList,
    setProducers,
    setDisconnectedUsers,
    getUserById,
    changeUserBoardPermission,
  })

  const roomContext = {
    ...roomData,
    getUserById,
    changeUserBoardPermission,
    getUserBoardPermission,
  }

  const usersInfoContext = {
    users,
  }

  const statesForMethodes = {
    setUserList,
    setDisconnectedUsers,
  }

  return {
    userId,
    roomId,
    isLoading,
    socket: socket.current,
    usersInfoContext,
    roomContext,
    statesForMethodes,
    disconnectedUsers,
    ...statesChangeWithSocket,
  }
}

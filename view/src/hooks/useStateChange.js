import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'

import { URL } from '../config'
import { useSocketInit } from './notExported'
import { useRoomDataFilter, useProducerChange } from './notExported'

export const useStateChange = () => {
  const { userId, roomId } = useParams()

  const [ users, setUsers ] = useState([])
  const [ disconnectedUsers, setDisconnectedUsers ] = useState([])

  const socket = useRef(undefined)

  useEffect(() => {
    socket.current = io(URL + `?room_id=${roomId}&user_id=${userId}`, {
      secure: true,
      transports: [ 'websocket', 'polling' ]
    })

    socket.current.on('connect_error', () => {
      socket.current.io.opts.transports = [ 'polling', 'websocket' ];
      socket.current.io.opts.upgrade = true;
    })
  }, [ roomId, socket, userId ])

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

import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useCookies } from 'react-cookie'
import { useParams, useLocation } from 'react-router-dom'

import { URL } from '../config'
import { useSocketInit } from './notExported'
import { useRoomDataFilter, useProducerChange } from './notExported'

export const useStateChange = () => {
  const params = useParams()
  const location = useLocation()
  const socket = useRef(undefined)

  const [ cookies ] = useCookies([ 'token' ])

  const [ users, setUsers ] = useState([])
  const [ room, setRoom ] = useState({ roomId: '', userId: '' })
  const [ disconnectedUsers, setDisconnectedUsers ] = useState([])

  useEffect(() => {
    const { roomId } = params;
    const token = cookies.token || location.search.split('=')[1];

    if (!token)
      return window.location
        .replace(`https://staging.univern.org/auth/login?redirect_url=${URL}/${roomId}`)

    fetch(`${URL}/signin/decode`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(({ data: { user_token_id } }) => {
        socket.current = io(`${URL}?room_id=${roomId}&user_id=${user_token_id}`, {
          secure: true,
          transports: [ 'websocket', 'polling' ]
        })

        socket.current.on('connect_error', () => {
          socket.current.io.opts.transports = [ 'polling', 'websocket' ];
          socket.current.io.opts.upgrade = true;
        })
        setRoom({ roomId, userId: user_token_id })
      })
      .catch(e => {
        console.error(e)
      })
  }, [ cookies, params, location.search ])

  const [
    isLoading,
    roomData,
    getUserById,
    changeUserBoardPermission,
    getUserBoardPermission,
  ] = useRoomDataFilter(room.userId, socket.current)

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

  const statesForMethods = {
    setUserList,
    setDisconnectedUsers,
  }

  return {
    userId: room.userId,
    roomId: room.roomId,
    isLoading,
    socket: socket.current,
    usersInfoContext,
    roomContext,
    statesForMethods,
    disconnectedUsers,
    ...statesChangeWithSocket,
  }
}

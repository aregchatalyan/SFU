import { io } from 'socket.io-client'
import { useCookies } from 'react-cookie'
import { useParams, useHistory } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'

import { URL } from '../config'
import { useHttp } from './useHttp'
import { useSocketInit } from './notExported'
import { useRoomDataFilter, useProducerChange } from './notExported'

const redirectURL = process.env.NODE_ENV === 'development'
  ? URL.replace('3030', '3000')
  : URL

export const useStateChange = () => {
  const params = useParams()
  const history = useHistory()
  const { request } = useHttp()
  const socket = useRef(undefined)
  const [ cookies ] = useCookies([ 'token' ])

  const [ users, setUsers ] = useState([])
  const [ room, setRoom ] = useState({ roomId: '', userId: '' })
  const [ disconnectedUsers, setDisconnectedUsers ] = useState([])

  const queries = useMemo(() => {
    return new URLSearchParams(history.location.search)
  }, [ history.location.search ])

  useEffect(() => {
    const { roomId } = params
    const token = cookies.token || queries.get('token')

    if (roomId === 'undefined') return history.push('/')

    if (!token)
      return window.location
        .replace(`https://staging.univern.org/auth/login?redirect_url=${redirectURL}/${roomId}`);

    (async () => {
      const {
        data: { user_id }
      } = await request(
        `${URL}/signin/decode`,
        'GET',
        null,
        { Authorization: `Bearer ${token}` }
      )

      socket.current = io(`${URL}?room_id=${roomId}&user_id=${user_id}`, {
        secure: true,
        transports: [ 'websocket', 'polling' ]
      })

      socket.current.on('connect_error', () => {
        socket.current.io.opts.transports = [ 'polling', 'websocket' ]
        socket.current.io.opts.upgrade = true
      })

      setRoom({ roomId, userId: user_id })
    })()
  }, [ cookies, history, params, request, queries ])

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

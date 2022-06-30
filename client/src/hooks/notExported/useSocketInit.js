import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toastPermission } from '../../components/core/Toast'
import { exit, removeConsumer } from '../../services'

export const useSocketInit = ({
                                socket,
                                setUserList,
                                setProducers,
                                setDisconnectedUsers,
                                getUserById,
                                changeUserBoardPermission,
                              }) => {
  const history = useHistory()

  const [ massages, setMassages ] = useState([])
  const [ polls, setPolls ] = useState([])
  const [ hands, setHands ] = useState([])

  useEffect(() => {
    if (socket) {
      socket.on('forbidden', ({ roomId }) => {
        history.push(`/${roomId}`)
      })
      socket.on('consumerClosed', function ({ consumer_id }) {
        console.log('Closing consumer:', consumer_id)
        removeConsumer(consumer_id, setUserList)
      })
      socket.on('newProducers', async function (data) {
        console.log('newProducers :: ', data)
        setProducers([ ...data ])
      })
      socket.on('newUsers', async function (data) {
        let exists = false

        const users = data.map((elm) => {
          setDisconnectedUsers((state) => {
            return [ ...state ].filter((id) => id !== elm.userId)
          })
          return { ...getUserById(elm.userId), ...elm }
        })

        setUserList((state) => {
          return [ ...state ].map((elm) => {
            if (elm.userId === users[0].userId) {
              exists = true
              return users[0]
            }
            return elm
          })
        })

        if (!exists) {
          await setUserList((state) => [ ...state, ...users ])
        }
      })
      socket.on('askToJoin', ({ userId }) => {
        const { name, surname } = getUserById(userId)
        toastPermission({
          name,
          surname,
          handlePermissionChange: (allowed) =>
            changeUserBoardPermission({ allowed, userId }),
        })
      })
      socket.on('newMassage', async function (data) {
        setMassages((state) => [ ...state, ...data ])
      })
      socket.on('newPoll', function (data) {
        setPolls((state) => [ ...data, ...state ])
      })
      socket.on('newVote', async function (data) {
        console.log(`NewVote : `, data)
        setPolls((state) => {
          const res = [ ...state ].map((elm) => {
            if (elm.id === data.id) {
              return data
            } else {
              return elm
            }
          })
          return [ ...res ]
        })
      })
      socket.on('newHandUp', async function (data) {
        setHands((state) => [ ...state, ...data ])
        console.log('HandUp', data)
      })
      socket.on('userLeft', async ({ socket_id }) => {
        setUserList((state) => {
          const res = [ ...state ].filter((elm) => {
            if (elm.id === socket_id) {
              elm.stream = undefined
              elm.consumerId = undefined
              setProducers([])
              return false
            }
            return true
          })
          return res
        })
      })
      socket.on('userConnectionProblem', (data) => {
        console.log('user internet loss', data)
        setDisconnectedUsers((prev) => [ ...prev, data.userId ])
      })
      socket.on('disconnect', function () {
        exit(true, socket)
      })
    }

    return () => {
      if (!socket) return
      socket.off('forbidden')
      socket.off('consumerClosed')
      socket.off('newProducers')
      socket.off('newUsers')
      socket.off('askToJoin')
      socket.off('newMassage')
      socket.off('newPoll')
      socket.off('newVote')
      socket.off('newHandUp')
      socket.off('userLeft')
      socket.off('userConnectionProblem')
    }
  }, [
    socket,
    history,
    setUserList,
    setProducers,
    getUserById,
    changeUserBoardPermission,
    setDisconnectedUsers,
  ])

  return { massages, polls, hands }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toastConnected } from '../../components/core/Toast'
import { closeProducer } from '../../services'

export const useConnectAndDisconnect = ({
                                          isReady,
                                          socket,
                                          videoPlayer,
                                          microphone,
                                          setStream,
                                          setAudioStream,
                                          setDisconnectedUsers,
                                          handleConfirm,
                                        }) => {
  // ref and state

  const timeout = useRef()
  const [ connection, setConnection ] = useState(
    navigator.onLine ? 'connected' : 'disconnected'
  )
  const history = useHistory()

  // methods

  const handleConnectionChange = useCallback(
    ({ type }) => {
      if (type === 'online') {
        clearTimeout(timeout.current)
        setConnection('connected')
        if (isReady) {
          setDisconnectedUsers([])
          handleConfirm()
          toastConnected()
        }
      } else if (type === 'offline') {
        setConnection('connecting')
        if (videoPlayer) closeProducer('videoType', socket, setStream)
        if (microphone) closeProducer('audioType', socket, setAudioStream)
        clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
          setConnection('disconnected')
          history.go(0)
        }, 10000)
      }
    },
    [
      socket,
      isReady,
      videoPlayer,
      microphone,
      handleConfirm,
      setDisconnectedUsers,
      setStream,
      setAudioStream,
      history,
    ]
  )

  useEffect(() => {
    window.addEventListener('online', handleConnectionChange)
    window.addEventListener('offline', handleConnectionChange)
    return () => {
      window.removeEventListener('online', handleConnectionChange)
      window.removeEventListener('offline', handleConnectionChange)
    }
  })
  return connection
}

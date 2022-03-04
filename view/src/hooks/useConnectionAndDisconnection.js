import { useEffect, useRef, useState } from 'react'

export const useConnectAndDisconnect = () => {
  const timeout = useRef()
  const [connection, setConnection] = useState(
    navigator.onLine ? 'connected' : 'disconnected'
  )

  const handleConnectionChange = ({ type }) => {
    if (type === 'online') {
      clearTimeout(timeout.current)
      setConnection('connected')
    } else if (type === 'offline') {
      setConnection('connecting')
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => {
        setConnection('disconnected')
      }, 10000)
    }
  }
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

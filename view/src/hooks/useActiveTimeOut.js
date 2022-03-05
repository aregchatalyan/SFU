import { useEffect, useState } from 'react'

export const useActiveTimeOut = (ref) => {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let timeout
    const mouseMove = ({ target }) => {
      setIsActive(true)
      clearTimeout(timeout)
      if (isActive && ref.current && !ref.current.contains(target)) {
        timeout = setTimeout(() => setIsActive(false), 10000)
      }
    }
    document.addEventListener('mousemove', mouseMove)
    return () => document.removeEventListener('mousemove', mouseMove)
  })

  return isActive
}

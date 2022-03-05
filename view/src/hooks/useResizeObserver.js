import { useCallback, useEffect, useState } from 'react'

export const useResizeObserver = (ref) => {
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()

  const handleResize = useCallback((entries) => {
    if (!Array.isArray(entries)) {
      return
    }

    const entry = entries[0]
    setWidth(entry.contentRect.width)
    setHeight(entry.contentRect.height)
  }, [])

  useEffect(() => {
    if (ref && ref.current) {
      let RO = new ResizeObserver((entries) => handleResize(entries))
      RO.observe(ref.current)

      return () => {
        RO.disconnect()
        RO = null
      }
    }
  }, [ref, handleResize])

  return [width, height]
}

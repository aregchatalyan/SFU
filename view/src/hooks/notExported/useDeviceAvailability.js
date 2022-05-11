import { useState } from 'react'

export const useDeviceAvailability = () => {
  const [ isAudioDeviceAvailable, setIsAudioDeviceAvailable ] = useState(false)
  const [ isVideoDeviceAvailable, setIsVideoDeviceAvailable ] = useState(false);

  (async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()

    setIsVideoDeviceAvailable(devices.some(({ kind }) => kind === 'videoinput'))
    setIsAudioDeviceAvailable(devices.some(({ kind }) => kind === 'audioinput'))
  })()

  return { isAudioDeviceAvailable, isVideoDeviceAvailable }
}

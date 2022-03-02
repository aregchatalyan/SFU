import { useState } from 'react'
export const useDeviceAvailability = () => {
  const [isAudioDeviceAvailable, setIsAudioDeviceAvailable] = useState(false)
  const [isVideoDeviceAvailable, setIsVideoDeviceAvailable] = useState(false)
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  const enumerateDevices = () =>
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setIsVideoDeviceAvailable(
        devices.some(({ kind }) => kind === 'videoinput')
      )
      setIsAudioDeviceAvailable(
        devices.some(({ kind }) => kind === 'audioinput')
      )
    })

  navigator.mediaDevices.ondevicechange = enumerateDevices

  enumerateDevices()
  return {
    isAudioDeviceAvailable,
    isVideoDeviceAvailable,
  }
}

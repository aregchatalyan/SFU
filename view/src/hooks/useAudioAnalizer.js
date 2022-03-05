import { useEffect, useState } from 'react'

export const useAudioAnalizer = (stream) => {
  const [dataArray, setDataArray] = useState(new Uint8Array(0))

  window.AudioContext = window.AudioContext || window.webkitAudioContext

  useEffect(() => {
    if (stream) {
      const ctx = new window.AudioContext()
      const analyser = ctx.createAnalyser()
      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)
      source.connect(ctx.destination)
      analyser.fftSize = 32
      const bufferLength = analyser.frequencyBinCount
      let dataArray = new Uint8Array(bufferLength)
      const update = () => {
        requestAnimationFrame(update)
        analyser.getByteFrequencyData(dataArray)
        setDataArray(dataArray)
      }
      update()
    }
  }, [stream])
  return dataArray
}

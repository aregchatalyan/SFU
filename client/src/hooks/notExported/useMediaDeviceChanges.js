import { useCallback, useEffect, useState } from 'react'
import { toastError } from '../../components/core/Toast'
import { getStream } from '../../helpers'
import { closeProducer, produce } from '../../services'

export const useMediaDeviceChanges = ({
                                        socket,
                                        isReady,
                                        microphone,
                                        videoPlayer,
                                        audioStream,
                                        setStream,
                                        setAudioStream,
                                        setMicrophone,
                                        setVideoPlayer,
                                        isVideoDeviceAvailable,
                                        isAudioDeviceAvailable,
                                        videoPermission,
                                        audioPermission,
                                      }) => {
  const [ mediaErr, setMediaErr ] = useState({})

  const tryToConnect = useCallback(() => {
    const errorCollector = {
      isAnyErr: false,
      mainErrType: undefined,
      videoPermission: true,
      videoDevice: true,
      audioPermission: true,
      audioDevice: true,
    }

    getStream('all')
      .then((res) => {
        setVideoPlayer(true)
        setMicrophone(true)
        setStream(res)
      })
      .catch((err) => {
        errorCollector.isAnyErr = true
        errorCollector.mainErrType = 'Requested device not found' === err.message
          ? 'device'
          : 'permission'

        setVideoPlayer(false)
        setMicrophone(false)

        getStream('video')
          .then((res) => {
            errorCollector[
              `${
                errorCollector.mainErrType === 'device'
                  ? 'audioDevice'
                  : 'audioPermission'
              }`
              ] = false
            setMediaErr(errorCollector)
            setStream(res)
            setVideoPlayer(true)
          })
          .catch((err) => {
            errorCollector[
              `${
                'Requested device not found' === err.message
                  ? 'videoDevice'
                  : 'videoPermission'
              }`
              ] = false

            setVideoPlayer(false)
            getStream('audio')
              .then(() => {
                setMediaErr(errorCollector)

                setMicrophone(true)
              })
              .catch((err) => {
                errorCollector[
                  `${
                    'Requested device not found' === err.message
                      ? 'audioDevice'
                      : 'audioPermission'
                  }`
                  ] = false
                setMediaErr(errorCollector)
              })
          })
      })
  }, [ setMicrophone, setVideoPlayer, setStream ])

  useEffect(() => {
    if (!isReady) {
      tryToConnect()
    }
  }, [ isReady, tryToConnect ])

  useEffect(() => {
    if (mediaErr.isAnyErr) {
      if (
        !mediaErr.videoDevice &&
        !mediaErr.audioDevice &&
        mediaErr.mainErrType === 'device'
      ) {
        toastError('Media devices are not available')
      } else if (!mediaErr.videoDevice) {
        toastError('Video device not found ')
      } else if (!mediaErr.audioDevice) {
        toastError('Audio device not found ')
      }
    }
    if (
      !mediaErr.videoPermission &&
      !mediaErr.audioPermission &&
      mediaErr.mainErrType === 'permission'
    ) {
      toastError('Mediadevices permissions are disabled')
    } else if (!mediaErr.videoPermission && mediaErr.videoDevice) {
      toastError('Your video permission is disabled.')
    } else if (mediaErr.audioPermission && mediaErr.audioDevice) {
      toastError('Your voice permission is disabled.')
    }
  }, [ mediaErr ])

  useEffect(() => {
    if (audioPermission && isAudioDeviceAvailable && !microphone) {
      if (isReady) {
        produce('audioType', null, socket, setAudioStream)
        setMicrophone(true)
      } else {
        getStream('audio').then((res) => {
          setAudioStream(res)
          setMicrophone(true)
        })
      }
    } else if ((!audioPermission || !isAudioDeviceAvailable) && microphone) {
      if (isReady) {
        closeProducer('audioType', socket, setAudioStream)
      } else {
        setStream((stream) => {
          stream &&
          stream
            .getTracks()
            .forEach((track) => track.kind === 'audio' && track.stop())
          return stream
        })
        if (audioStream) {
          setAudioStream((stream) => {
            stream &&
            stream
              .getTracks()
              .forEach((track) => track.kind === 'audio' && track.stop())
            return stream
          })
        }
      }
      setMicrophone(false)
    }
  }, [ socket, isAudioDeviceAvailable, audioPermission ]) // eslint-disable-line

  useEffect(() => {
    if (videoPermission && isVideoDeviceAvailable && !videoPlayer) {
      if (isReady) {
        produce('videoType', null, socket, setStream)
        setVideoPlayer(true)
      } else {
        getStream('video').then((res) => {
          setStream(res)
          setVideoPlayer(true)
        })
      }
    } else if ((!videoPermission || !isVideoDeviceAvailable) && videoPlayer) {
      if (isReady) {
        closeProducer('videoType', socket, setStream)
      } else {
        setStream((stream) => {
          stream &&
          stream.getTracks().forEach((track) => track.kind === 'video' && track.stop())
          return stream
        })
      }
      setVideoPlayer(false)
    }
  }, [ socket, isVideoDeviceAvailable, videoPermission ]) // eslint-disable-line
}

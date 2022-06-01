import { useCallback, useState } from 'react'
import {
  useConnectAndDisconnect,
  useDeviceAvailability,
  useMediaDeviceChanges,
  useNavigationPermission,
} from './notExported'
import { toastError } from '../components/core/Toast'
import { firstPage } from '../constant'
import { getStream } from '../helpers'
import { closeProducer, exit, joinRoom, produce } from '../services'

export const useHandleMethodes = ({
                                    socket,
                                    userId,
                                    roomId,
                                    setUserList,
                                    getUserById,
                                    setDisconnectedUsers,
                                    recSocket,
                                    recPeer
                                  }) => {
  // ref and state

  const [ isJoining, setIsJoining ] = useState(false)
  const [ isReady, setIsReady ] = useState(false)
  const [ videoPlayer, setVideoPlayer ] = useState(false)
  const [ stream, setStream ] = useState(null)
  const [ screenStream, setScreenStream ] = useState(undefined)
  const [ microphone, setMicrophone ] = useState(false)
  const [ audioStream, setAudioStream ] = useState(undefined)

  const { isVideoDeviceAvailable, isAudioDeviceAvailable } =
    useDeviceAvailability()
  const { videoPermission, audioPermission } = useNavigationPermission()

  // methods

  const handleVideoClick = useCallback(() => {
    if (videoPermission && isVideoDeviceAvailable) {
      if (!videoPlayer) {
        if (isReady) {
          produce('videoType', null, socket, setStream)
          setVideoPlayer(true)
        } else {
          getStream('video').then((res) => {
            setStream(res)
            setVideoPlayer(true)
          })
        }
      } else {
        if (isReady) {
          closeProducer('videoType', socket, setStream)
        } else {
          setStream((stream) => {
            stream &&
            stream
              .getTracks()
              .forEach((track) => track.kind === 'video' && track.stop())
            return stream
          })
        }
        setVideoPlayer(false)
      }
    } else if (isVideoDeviceAvailable) {
      toastError(firstPage.videoPermission)
    } else {
      toastError('Video device not found ')
    }
  }, [ isReady, socket, isVideoDeviceAvailable, videoPermission, videoPlayer ])

  const handleMicrophoneClick = () => {
    if (audioPermission && isAudioDeviceAvailable) {
      if (!microphone) {
        if (isReady) {
          produce('audioType', null, socket, setAudioStream)
          setMicrophone(true)
        } else {
          getStream('audio').then((res) => {
            setAudioStream(res)
            setMicrophone(true)
          })
        }
      } else {
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
    } else if (isAudioDeviceAvailable) {
      toastError(firstPage.voicePermission)
    } else {
      toastError('Audio device not found ')
    }
  }

  const handleConfirm = useCallback(() => {
    recSocket.send(JSON.stringify({
      action: 'start-record',
      sessionId: recPeer.sessionId
    }))

    setIsJoining(true)
    joinRoom({
      userId,
      room_id: roomId,
      socket,
      setUserList,
      getUserById,
    }).then(() => {
      setIsJoining(false)
      setIsReady(true)
      setStream(
        (stream) =>
          stream && stream.getTracks().forEach((track) => track.stop())
      )
      setAudioStream(
        (stream) =>
          stream && stream.getTracks().forEach((track) => track.stop())
      )
      if (videoPlayer) {
        produce('videoType', null, socket, setStream)
      }
      if (microphone) {
        produce('audioType', null, socket, setAudioStream)
      }
    })
  }, [
    socket,
    userId,
    roomId,
    setUserList,
    getUserById,
    videoPlayer,
    microphone,
  ])

  const handleFullScreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen().catch((e) => {
      })
    }
  }, [])

  const handleSharing = useCallback(() => {
    if (screenStream) {
      closeProducer('screenType', socket, setScreenStream)
    } else {
      produce('screenType', null, socket, (stream) => {
        if (stream) {
          stream.getVideoTracks()[0].onended = () =>
            setScreenStream((stream) => {
              stream && stream.getTracks().forEach((track) => track.stop())
            })
        }
        setScreenStream(stream)
      })
    }
  }, [ screenStream, socket ])

  const connection = useConnectAndDisconnect({
    isReady,
    socket,
    videoPlayer,
    microphone,
    setStream,
    setAudioStream,
    handleConfirm,
    setDisconnectedUsers,
  })

  const handleLeaveMeeting = useCallback(() => {
    recSocket.send(JSON.stringify({
      action: 'stop-record',
      sessionId: recPeer.sessionId
    }))

    recSocket.send(JSON.stringify({
      action: 'start-combine',
      sessionId: recPeer.sessionId
    }))

    if (videoPlayer) {
      closeProducer('videoType', socket, setStream)
    }
    if (microphone) {
      closeProducer('audioType', socket, setAudioStream)
    }
    if (connection === 'connected') {
      exit(false, socket, () => {
        setIsReady(false)
        setDisconnectedUsers([])
      })
    } else {
      setIsReady(false)
      setDisconnectedUsers([])
    }
  }, [ socket, microphone, videoPlayer, connection, setDisconnectedUsers ])

  useMediaDeviceChanges({
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
  })

  return {
    isJoining,
    isReady,
    videoPlayer,
    stream,
    microphone,
    audioStream,
    screenStream,
    handleVideoClick,
    handleMicrophoneClick,
    handleConfirm,
    handleFullScreen,
    handleSharing,
    handleLeaveMeeting,
    connecting: connection === 'connecting',
  }
}

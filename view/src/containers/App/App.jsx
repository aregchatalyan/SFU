import React, { useState, useEffect, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { UserInfoContext, DimensionsContext } from '../../Context'
import {
  useWindowDimensions,
  useProducerChange,
  useRoomDataFilter,
  useDeviceAvailability,
} from '../../hooks'
import { URL } from '../../config'

import io from 'socket.io-client'
import { closeProducer, exit, joinRoom, produce } from '../../services'
import Waiting from '../../components/waiting'
import VideoCall from '../../components/pages/VideoCall'
import { useNavigationPermission } from '../../hooks'
import {
  toastify,
  ErrorToast,
  ConnectedToast,
} from '../../components/core/Toast'
import { firstPage } from '../../constant'
import { getStream } from '../../helpers'
import { RoomInfoContext } from '../../Context/roomInfoContext'
import PreJoin from '../../components/preJoining'
import { toast, ToastContainer } from 'react-toastify'
import { useConnectAndDisconnect } from '../../hooks/useConnectionAndDisconnection'

const App = () => {
  // params
  const { userId, roomId } = useParams()
  const history = useHistory()

  // hooks

  const size = useWindowDimensions()
  const { videoPermission, audioPermission } = useNavigationPermission()
  const { isAudioDeviceAvailable, isVideoDeviceAvailable } =
    useDeviceAvailability()
  const connection = useConnectAndDisconnect()

  // state

  const [users, setUsers] = useState([])
  const [socket, setSocket] = useState()
  const [isReady, setIsReady] = useState(false)
  const [videoPlayer, setVideoPlayer] = useState(false)
  const [microphone, setMicrophone] = useState(false)
  const [stream, setStream] = useState(null)
  const [audioStream, setAudioStream] = useState(undefined)
  const [screenStream, setScreenStream] = useState()
  const [massages, setMassages] = useState([])
  const [polls, setPolls] = useState([])
  const [hands, setHands] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)

  // minchev stex sax toshni e
  const [fullScreen, setFullScreen] = useState(true)

  const [
    roomData,
    setRoomData,
    getUserById,
    changeUserBoardPermission,
    getUserBoardPermission,
  ] = useRoomDataFilter(userId, socket)
  const { setUserList, setProducers } = useProducerChange(
    socket,
    setUsers,
    roomData
  )

  // hmi methodner@

  const confirmMiting = () => {
    setIsJoining(true)
    joinRoom(
      userId,
      roomId,
      socket,
      setUserList,
      setProducers,
      setMassages,
      setPolls,
      setHands,
      getUserById,
      changeUserBoardPermission
    ).then((dev) => {
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
  }
  const leaveMeeting = () => {
    if (videoPlayer) {
      closeProducer('videoType', socket, setStream)
    }
    if (microphone) {
      closeProducer('audioType', socket, setAudioStream)
    }
    if (connection === 'connected') {
      exit(false, socket, () => {
        setIsReady(false)
      })
    } else {
      setIsReady(false)
    }
    history.go(0)
  }

  const shareScreen = () => {
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
  }

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
      toastify(<ErrorToast text={firstPage.videoPermission} />)
    } else {
      toastify(<ErrorToast text="Video device not found " />)
    }
  }, [isReady, socket, isVideoDeviceAvailable, videoPermission, videoPlayer])

  // chotki ashxdox metodner
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
      toastify(<ErrorToast text={firstPage.voicePermission} />)
    } else {
      toastify(<ErrorToast text="Audio device not found " />)
    }
  }

  const windowFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen().catch((e) => {})
    }
  }
  // xnamqi kariq unecoxner

  useEffect(() => {
    const socket = io(`${URL}?room_id=${roomId}&user_id=${userId}`, {
      secure: true,
    })
    setSocket(socket)
    socket.on('connected', (data) => {
      setIsLoading(false)
      setRoomData(data)
    })
    socket.on('forbidden', () => {
      history.push('/error')
    })

    document.addEventListener('fullscreenchange', changeWidth)
    return document.removeEventListener('fullscreenchange', changeWidth)
  }, [roomId, history])

  useEffect(() => {
    if (connection === 'connected' && isReady) {
      confirmMiting()
      toast(<ConnectedToast />, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        closeButton: false,
        // transition: Slide,
      })
    } else if (connection === 'connecting') {
      if (videoPlayer) closeProducer('videoType', socket, setStream)
      if (microphone) closeProducer('audioType', socket, setAudioStream)
    } else if (connection === 'disconnected') {
      history.go(0)
    }
  }, [connection]) // eslint-disable-line

  useEffect(() => {
    if (!isReady && !isLoading) {
      getStream('all')
        .then((res) => {
          setVideoPlayer(true)
          setMicrophone(true)
          setStream(res)
        })
        .catch(() => {
          setVideoPlayer(false)
          setMicrophone(false)
          getStream('video')
            .then((res) => {
              if (!isAudioDeviceAvailable) {
                toastify(<ErrorToast text="Audio device not found" />)
              } else if (!audioPermission) {
                toastify(<ErrorToast text={firstPage.voicePermission} />)
              }
              setStream(res)
              setVideoPlayer(true)
            })
            .catch(() => {
              if (videoPermission) {
                toastify(<ErrorToast text="Video device not found " />)
              } else if (isVideoDeviceAvailable) {
                toastify(<ErrorToast text={firstPage.videoPermission} />)
              }
              setVideoPlayer(false)
              getStream('audio')
                .then(() => {
                  setMicrophone(true)
                })
                .catch(() => {
                  if (!isAudioDeviceAvailable) {
                    toastify(<ErrorToast text="Audio device not found" />)
                  } else if (!audioPermission) {
                    toastify(<ErrorToast text={firstPage.voicePermission} />)
                  }
                })
            })
        })
    }
  }, [
    videoPermission,
    audioPermission,
    isReady,
    isLoading,
    isAudioDeviceAvailable,
    isVideoDeviceAvailable,
  ])

  const changeWidth = () => {
    if (window.innerHeight === window.screen.height) {
      setFullScreen(false)
    } else {
      setFullScreen(true)
    }
  }

  return (
    <RoomInfoContext.Provider
      value={{
        ...roomData,
        changeUserBoardPermission,
        getUserBoardPermission,
        getUserById,
      }}
    >
      <UserInfoContext.Provider value={{ users }}>
        <React.StrictMode>
          <DimensionsContext.Provider value={size}>
            {isLoading ? (
              <PreJoin loading={isLoading} />
            ) : !isReady ? (
              <Waiting
                {...{
                  stream,
                  videoPlayer,
                  handleVideoClick,
                  microphone,
                  handleMicrophoneClick,
                  handleConfirm: confirmMiting,
                  audioStream,
                  isJoining,
                }}
              />
            ) : (
              <VideoCall
                microphone={microphone}
                handleSharing={shareScreen}
                handleFullScreen={windowFullScreen}
                {...{
                  userId,
                  fullScreen,
                  videoPlayer,
                  handleVideoClick,
                  handleMicrophoneClick,
                  microphone,
                  roomId,
                  stream,
                  screenStream,
                  massages,
                  leaveMeeting,
                  hands,
                  setHands,
                  polls,
                  socket,
                  audioStream,
                  connnecting: connection === 'connecting',
                }}
              />
            )}
          </DimensionsContext.Provider>
        </React.StrictMode>
        <ToastContainer style={{ minWidth: '390px' }} />
      </UserInfoContext.Provider>
    </RoomInfoContext.Provider>
  )
}

export default App

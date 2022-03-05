import React from 'react'

import { ToastContainer } from 'react-toastify'

import {
  UsersInfoContext,
  DimensionsContext,
  RoomInfoContext,
  SocketContext,
} from '../../Context'

import {
  useWindowDimensions,
  useStateChange,
  useHandleMethodes,
} from '../../hooks'

import PreJoin from '../../components/preJoining'
import Waiting from '../../components/waiting'
import VideoCall from '../../components/pages/VideoCall'

const App = () => {
  const {
    userId,
    roomId,
    isLoading,
    socket,
    usersInfoContext,
    roomContext,
    statesForMethodes,
    ...videoCallState
  } = useStateChange()

  const {
    isJoining,
    isReady,
    videoPlayer,
    microphone,
    stream,
    audioStream,
    handleVideoClick,
    handleMicrophoneClick,
    handleConfirm,
    ...videoCallProps
  } = useHandleMethodes({
    socket,
    userId,
    roomId,
    getUserById: roomContext.getUserById,
    ...statesForMethodes,
  })
  const dimissionContext = useWindowDimensions()

  // useEffect(() => {
  //   if (!isReady && !isLoading) {
  //     getStream('all')
  //       .then((res) => {
  //         setVideoPlayer(true)
  //         setMicrophone(true)
  //         setStream(res)
  //       })
  //       .catch(() => {
  //         setVideoPlayer(false)
  //         setMicrophone(false)
  //         getStream('video')
  //           .then((res) => {
  //             if (!isAudioDeviceAvailable) {
  //               toastError('Audio device not found')
  //             } else if (!audioPermission) {
  //               toastError(firstPage.voicePermission)
  //             }
  //             setStream(res)
  //             setVideoPlayer(true)
  //           })
  //           .catch(() => {
  //             if (videoPermission) {
  //               toastError('Video device not found ')
  //             } else if (isVideoDeviceAvailable) {
  //               toastError(firstPage.videoPermission)
  //             }
  //             setVideoPlayer(false)
  //             getStream('audio')
  //               .then(() => {
  //                 setMicrophone(true)
  //               })
  //               .catch(() => {
  //                 if (!isAudioDeviceAvailable) {
  //                   toastError('Audio device not found')
  //                 } else if (!audioPermission) {
  //                   toastError(firstPage.voicePermission)
  //                 }
  //               })
  //           })
  //       })
  //   }
  // }, [
  //   videoPermission,
  //   audioPermission,
  //   isReady,
  //   isLoading,
  //   isAudioDeviceAvailable,
  //   isVideoDeviceAvailable,
  // ])

  return (
    <RoomInfoContext.Provider value={roomContext}>
      <UsersInfoContext.Provider value={usersInfoContext}>
        <SocketContext.Provider value={socket}>
          <React.StrictMode>
            <DimensionsContext.Provider value={dimissionContext}>
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
                    handleConfirm,
                    audioStream,
                    isJoining,
                  }}
                />
              ) : (
                <VideoCall
                  {...{
                    userId,
                    videoPlayer,
                    handleVideoClick,
                    handleMicrophoneClick,
                    microphone,
                    roomId,
                    stream,
                    audioStream,
                    ...videoCallProps,
                    ...videoCallState,
                  }}
                />
              )}
            </DimensionsContext.Provider>
          </React.StrictMode>
        </SocketContext.Provider>
        <ToastContainer style={{ minWidth: '390px' }} />
      </UsersInfoContext.Provider>
    </RoomInfoContext.Provider>
  )
}

export default App

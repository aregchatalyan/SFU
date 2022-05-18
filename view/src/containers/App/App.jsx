import React from 'react'
import { ToastContainer } from 'react-toastify'

import {
  socket as recSocket,
  peer as recPeer
} from '../../func/main'

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
    recSocket,
    recPeer
  })
  const dimissionContext = useWindowDimensions()

  return (
    <RoomInfoContext.Provider value={roomContext}>
      <UsersInfoContext.Provider value={usersInfoContext}>
        <SocketContext.Provider value={socket}>
          <React.StrictMode>
            <DimensionsContext.Provider value={dimissionContext}>
              {isLoading ? (
                <PreJoin loading={isLoading}/>
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
        <ToastContainer style={{ minWidth: '390px' }}/>
      </UsersInfoContext.Provider>
    </RoomInfoContext.Provider>
  )
}

export default App

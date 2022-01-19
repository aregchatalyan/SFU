import React, { useRef, useEffect } from "react";
import Icon from "../Icon";
import VoiceWrapper from "../Voice";

const VideoWrapper = ({
  id,
  audioConsumerId,
  stream,
  audioStream,
  className,
  showMicState,
}) => {
  const userVideo = useRef();

  useEffect(() => {
    if (userVideo.current) userVideo.current.srcObject = stream;
  }, [stream]);

  return (
    <div className={className}>
      {stream ? (
        <video
          id={id}
          playsInline={false}
          autoPlay={true}
          ref={userVideo}
          muted
        />
      ) : (
        <Icon name="vidowrapper_user" width={259} height={259} />
      )}
      {showMicState && (
        <VoiceWrapper id={audioConsumerId} audioStream={audioStream} />
      )}
    </div>
  );
};
export default VideoWrapper;

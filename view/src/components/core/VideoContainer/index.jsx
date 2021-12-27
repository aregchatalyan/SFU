import React, { useRef, useEffect, useState } from "react";
import { UserBig } from "../../theme/Icons";

const VideoWrapper = ({ className, stream, id, smallStream }) => {
  const [showSmallVideo, setShowSmallVideo] = useState(true);
  const userVideo = useRef();
  const smallVideo = useRef();
  useEffect(() => {
    if (userVideo.current) userVideo.current.srcObject = stream;
    if (smallVideo.current) smallVideo.current.srcObject = smallStream;
  }, [stream, smallStream]);
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
        <UserBig />
      )}
      {smallStream && showSmallVideo && (
        <div
          className="smallVideo"
          onClick={() => {
            setShowSmallVideo(false);
          }}
        >
          <video
            id={id}
            playsInline={false}
            autoPlay={true}
            ref={smallVideo}
            muted
          />
        </div>
      )}
    </div>
  );
};
export default VideoWrapper;

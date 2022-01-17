import React, { useRef, useEffect } from "react";
import AudioSpectrum from "react-audio-spectrum";

const VoiceWrapper = ({ id, audioStream }) => {
  const userAudio = useRef();
  useEffect(() => {
    if (userAudio.current) userAudio.current.srcObject = audioStream;
  }, [audioStream]);

  return (
    <>
      <audio id={id} playsInline={false} autoPlay={true} ref={userAudio} />
      <AudioSpectrum
        audioId={id}
        capColor={"red"}
        capHeight={2}
        meterWidth={2}
        meterCount={64}
        meterColor={[
          { stop: 0, color: "#f00" },
          { stop: 0.5, color: "#0CD7FD" },
          { stop: 1, color: "red" },
        ]}
        gap={4}
      />
    </>
  );
};

export default VoiceWrapper;

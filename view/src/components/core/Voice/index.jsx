import React, { useRef, useEffect } from "react";
import Icon from "../Icon";
import style from "./style.module.scss";

const VoiceWrapper = ({ id, audioStream }) => {
  const userAudio = useRef();

  useEffect(() => {
    if (userAudio.current) userAudio.current.srcObject = audioStream;
  }, [audioStream]);

  return (
    <div className={audioStream ? style.audioOn : style.audioOff}>
      {audioStream ? (
        <>
          <audio id={id} playsInline={false} autoPlay={true} ref={userAudio} />
          <Icon name="videowrapper_audio_on" width={24} height={24} />
        </>
      ) : (
        <Icon name="videowrapper_audio_off" width={24} height={24} />
      )}
    </div>
  );
};

export default VoiceWrapper;

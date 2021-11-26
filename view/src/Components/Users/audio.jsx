import React, { useRef, useEffect } from 'react';

const Audio = props => {
    const userAudioRef = useRef();

    useEffect(() => {
        console.log('useEffect-----------');
        if(userAudioRef.current){
            console.log('mtav audio', props.muted);
            userAudioRef.current.srcObject = props.stream;
        }
    }, [props.muted, props.stream]);

    return(
        <audio autoPlay  ref={userAudioRef} muted={props.muted} />
    )
};

export default Audio;
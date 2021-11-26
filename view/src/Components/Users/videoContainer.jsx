import React, { useRef, useEffect, useContext, memo } from 'react';
import classes from './style.module.css';
import { UserInfoContext } from '../../Context/userInfoContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneAltSlash, faHandPaper } from '@fortawesome/free-solid-svg-icons';
import AudioAnalyser from '../AudioAnalyser';

const VideoContainer = props => {
    const userVideoRef = useRef();
    const { users } = useContext(UserInfoContext);
    let { stream } = props;
    useEffect(() => {
        console.log('--------------------------------', props.index);
        if(props.screen) {
            document.getElementById(`userVideo${props.index}`).srcObject = users[props.index].screenStream;
        }
        else {
            document.getElementById(`userVideo${props.index}`).srcObject = stream;
        }

    }, [props.screen, stream, props.video]);

    const getPrcent = (width, height, type) => {
        if(Number(width.slice(0, -1))+Number(height.slice(0, -1))>=100){
            if(type==='img'){
                return '100%';
            }
            else{
                return '140%';
            }
        }
        else{
            if(type==='img'){
                return `calc(${height} + ${width} + 10%)`;
            }
            else{
                return `calc(${height} + ${width} + 80%)`;
            }
        }
    };

    return (
        <>
            <div
                style={{
                    height: `${props.height}`,
                    width: `${props.width}`,
                    top: `${props.top}`,
                    left: `${props.left}`,
                    position: 'absolute'
                }}
                className={classes.videoPlayer}
            >
                <video
                    muted={true}
                    id={`userVideo${props.index}`}
                    onClick={() => props.handleSelectedUser(
                        props.screen ? users[props.index].screenStream : stream,
                        users[props.index].screen,
                        props.id,
                        props.myVideo
                    )}
                    autoPlay
                    style=
                        {
                            { 
                                transform: `${props.myVideo && !users[props.index].screen ? 'scaleX(-1)' : ''}`, 
                                objectFit: `${props.screen ? '' : 'cover'}`, 
                                display: `${users[props.index].videoStatus ? 'block' : 'none'}` 
                            }
                        }
                />
                {
                    // props.stream && props.audio && !props.selectedStream && !props.userList && !users[props.index].handUp ? 
                    // <div className={classes.vizualiser}>
                    //     <AudioAnalyser audio={props.stream} />
                    // </div>
                    // : users[props.index].handUp ?
                    // <div className={classes.vizualiser}>
                    //     <FontAwesomeIcon icon={faHandPaper} className='text-success' />
                    // </div>
                    // : null
                }
                
                {
                    props.video && <div className={classes.userName}>  {props.user.first_name} {props.user.last_name} </div>
                }
                {
                    !props.audio ? <div className={`${classes.muteMicrophone}`}><FontAwesomeIcon icon={faMicrophoneAltSlash} /></div> : null
                }
                {
                    !props.video && !props.screen ?
                    <div className={classes.userInfo}>
                        <div className={classes.userImage} style={{display: props.height==='50%' || props.width==='50%' ? 'block' : props.height==='100%' ? 'block' : 'flex'}}>
                            <div className='userImg' 
                                style={{width:  getPrcent(props.width, props.height, 'img'), 
                                height: getPrcent(props.width, props.height, 'img'),  backgroundImage: `url(${props.user.image})`}}
                            >
                            </div>
                        </div>
                        <h4 className="mt-2" style={{fontSize: getPrcent(props.width, props.height, 'text')}}> {props.user.first_name} {props.user.last_name} </h4>
                    </div>
                    : null
                }
            </div>
                   
        </>
    );
}

export default memo(VideoContainer);
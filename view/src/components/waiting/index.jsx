import React, { useRef, useEffect, useState, memo, useCallback } from "react";
import { firstPage } from "../../constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeftSideBar from "./LeftSideBar";
import MiddleBar from "./MiddleBar";
import RightSideBar from "./RightSideBar";
import "./style.scss";

const courseName =
  "UI /UX Design : Prototyping and Design system and something else";
const groupName =
  "UI /UX Design : Prototyping and Design system and something else";
const level = "medium";
const group = [
  {
    text: "Machine Learning A-Z : Hands-On Python & R in Science",
    date: "December 10 / 16:40",
  },
  {
    text: "The Python Mega Course:Build 10 Real World Applications",
    date: "July 9 / 16:40",
  },
  {
    text: "The Python Mega Course:Build 10 Real World Applications",
    date: "September 20 / 16:40",
  },
  {
    text: "Machine Learning A-Z : Hands-On Python & R in Science",
    date: "October 5 / 16:40",
  },
];
const lessons = [
  {
    text: "Machine Learning A-Z : Hands-On Python & R in Science",
    date: "December 10 / 16:40",
    level: "professional",
  },
  {
    text: "The Python Mega Course:Build 10 Real World Applications",
    date: "July 9 / 16:40",
    level: "medium",
  },
  {
    text: "The Python Mega Course:Build 10 Real World Applications",
    date: "September 20 / 16:40",
    level: "beginner",
  },
  {
    text: "Machine Learning A-Z : Hands-On Python & R in Science",
    date: "October 5 / 16:40",
  },
];
const teacherInfo = {
  name: "Anushik",
  surname: "Hakobyan",
  stars: 4,
  profession: "UI/UX Designer",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit a ultrices donec quam sed id rrying an smethung else and for expmle you will learn everthing during this course and will get important information about JavaScrip",
  videoCourses: 8,
  onlineLessons: 6,
  conference: 6,
  liveStream: 5,
};
const participants = [
  {
    name: "Khachatur ",
    surname: "Arukyan",
    grade: "9",
    absentCount: "2",
    attendingPercent: "92%",
  },
  {
    name: "Artur ",
    surname: "Xachatryan",
    grade: "10",
    absentCount: "1",
    attendingPercent: "98%",
  },
  {
    name: "Maria ",
    surname: "Vloeva",
    grade: "9",
    absentCount: "1",
    attendingPercent: "95%",
  },
  {
    name: "Tigran ",
    surname: "Petrosyan",
    grade: "9",
    absentCount: "2",
    attendingPercent: "92%",
  },
  {
    name: "Areg ",
    surname: "Chatalyan",
    grade: "8",
    absentCount: "3",
    attendingPercent: "90%",
  },
  {
    name: "Lucy ",
    surname: "Shegunc ",
    grade: "8",
    absentCount: "2",
    attendingPercent: "88%",
  },
  {
    name: "Hasmik ",
    surname: "Karapetyan",
    grade: "7",
    absentCount: "1",
    attendingPercent: "85%",
  },
  {
    name: "Jon  ",
    surname: "Smith",
    grade: "7",
    absentCount: "4",
    attendingPercent: "84%",
  },
  {
    name: "Irina ",
    surname: "Nikalayeva",
    grade: "6",
    absentCount: "3",
    attendingPercent: "73%",
  },
  {
    name: "Suren ",
    surname: "Khachatryan",
    grade: "5",
    absentCount: "3",
    attendingPercent: "72%",
  },
];

const Waiting = (props) => {
  const userVideo = useRef();
  const [stream, setStream] = useState();
  const [videoPlayer, setVideoPlayer] = useState(true);
  const [microphone, setMicrophone] = useState(true);
  const [loading, setLoading] = useState(false);
  const { handleConfirm, error, audioPermission, videoPermission } = props;

  const getStream = useCallback(() => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    navigator.getUserMedia(
      {
        video: {
          width: { min: 240, ideal: 1080, max: 2048 },
          height: { min: 144, ideal: 720, max: 1080 },
        },
        audio: true,
      },
      function (stream) {
        // setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        // setVideoPlayer(true);
        // setMicrophone(true);
        // setLoading(false);
      },
      (err) => {
        console.log("ERR : ", err);
        toast.error(firstPage.videoPermission, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          className: "black-background",
          bodyClassName: "bodyClass",
        });
      }
      // function (err) {
      //   console.log("microphone");
      //   navigator.getUserMedia(
      //     {
      //       audio: true,
      //     },
      //     () => {},
      //     // function (stream) {
      //     //   toast.error(firstPage.videoPermission, {
      //     //     position: "top-right",
      //     //     autoClose: 4000,
      //     //     hideProgressBar: true,
      //     //     closeOnClick: true,
      //     //     pauseOnHover: true,
      //     //     draggable: false,
      //     //     progress: undefined,
      //     //   });
      //     //   // setStream(stream);
      //     //   if (userVideo.current) {
      //     //     userVideo.current.srcObject = stream;
      //     //   }
      //     //   // setVideoPlayer(false);
      //     //   // setMicrophone(true);
      //     //   // props.handleControlers("video", false);
      //     //   // props.handleControlers("mic", true);
      //     //   // props.handleVideoPermission();
      //     //   // setLoading(false);
      //     // },
      //     () => {}
      //     // function (err) {
      //     //   navigator.getUserMedia(
      //     //     {
      //     //       video: {
      //     //         width: { min: 144, ideal: 1080, max: 2048 },
      //     //         height: { min: 144, ideal: 720, max: 1080 },
      //     //       },
      //     //     },
      //     //     function (stream) {
      //     //       toast.error(firstPage.voicePermission, {
      //     //         position: "top-right",
      //     //         autoClose: 4000,
      //     //         hideProgressBar: true,
      //     //         closeOnClick: true,
      //     //         pauseOnHover: true,
      //     //         draggable: false,
      //     //         progress: undefined,
      //     //       });
      //     //       setStream(stream);
      //     //       if (userVideo.current) {
      //     //         userVideo.current.srcObject = stream;
      //     //       }
      //     //       setVideoPlayer(true);
      //     //       setMicrophone(false);
      //     //       props.handleControlers("video", true);
      //     //       props.handleControlers("mic", false);
      //     //       props.handleAudioPermission();
      //     //       setLoading(false);
      //     //     },
      //     //     function (err) {
      //     //       toast.error(firstPage.globalPermisiion, {
      //     //         position: "top-right",
      //     //         autoClose: 4000,
      //     //         hideProgressBar: true,
      //     //         closeOnClick: true,
      //     //         pauseOnHover: true,
      //     //         draggable: false,
      //     //         progress: undefined,
      //     //       });
      //     //       setVideoPlayer(false);
      //     //       setMicrophone(false);
      //     //       props.handleControlers("video", !videoPlayer);
      //     //       props.handleControlers("mic", !microphone);
      //     //       props.handleVideoPermission();
      //     //       props.handleAudioPermission();
      //     //       setLoading(false);
      //     //     }
      //     //   );
      //     // }
      //   );
      // }
    );
  }, [microphone, props, videoPlayer]);

  useEffect(() => {
    if (error === false) {
      getStream();
    }
  }, [error, getStream]);

  useEffect(() => {
    if (!videoPermission) {
      setVideoPlayer(false);
    }
    if (!audioPermission) {
      setMicrophone(false);
    }
  }, [videoPermission, audioPermission]);

  function stopVideoOnly() {
    setVideoPlayer(!videoPlayer);
    props.handleControlers("video", !videoPlayer);
    if (!videoPlayer) {
      // getStream();
    } else {
      var videoTrack = stream.getVideoTracks();
      videoTrack.forEach((track) => {
        track.stop();
      });
    }
  }

  function stopAudioOnly() {
    if (audioPermission) {
      setMicrophone(!microphone);
      props.handleControlers("mic", !microphone);
    } else {
      console.log("SIK E ASHXADE");
    }
  }

  return (
    <div className="fullScreen">
      <LeftSideBar level={level} group={group} lessons={lessons} />
      <MiddleBar
        videoPlayer={videoPlayer}
        stopVideoOnly={stopVideoOnly}
        error={error}
        loading={loading}
        userVideo={userVideo}
        microphone={microphone}
        stopAudioOnly={stopAudioOnly}
        handleConfirm={handleConfirm}
        stream={stream}
        level={level}
        groupName={groupName}
        courseName={courseName}
        teacherInfo={teacherInfo}
      />
      <RightSideBar participants={participants} />
      <ToastContainer className="toast" />
    </div>
  );
};

export default memo(Waiting);

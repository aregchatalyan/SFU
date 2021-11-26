import UserInfo from "./UserInfo/UserInfo";
import "./style.scss";
import TeacherInfo from "./TeacherInfo/TeacherInfo";
import Info from "./Info/Info";
export default function MiddleBar({
  videoPlayer,
  stopVideoOnly,
  error,
  loading,
  userVideo,
  microphone,
  stopAudioOnly,
  handleConfirm,
  stream,
  level,
  groupName,
  courseName,
  teacherInfo,
}) {
  return (
    <div className="middleBar">
      <div className="title">
        <Info text={"onlineLessons"} type="large" color="#A93AFF" />
        {groupName}
      </div>
      <div className="head">
        <div className="text">
          <div className={`bigCircle ${level}`}></div>
          <span>{courseName}</span>
        </div>
      </div>
      <UserInfo
        videoPlayer={videoPlayer}
        stopVideoOnly={stopVideoOnly}
        error={error}
        loading={loading}
        userVideo={userVideo}
        microphone={microphone}
        stopAudioOnly={stopAudioOnly}
        handleConfirm={handleConfirm}
        stream={stream}
      />
      <TeacherInfo teacherInfo={teacherInfo} />
    </div>
  );
}

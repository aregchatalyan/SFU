import UserInfo from "./UserInfo";
import TeacherInfo from "./TeacherInfo";
import Info from "./Info";
import style from "./style.module.scss";

const MiddleBar = ({
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
}) => (
  <div className={style.middleBar}>
    <div className={style.title}>
      <Info text={"onlineLessons"} type="large" color="#A93AFF" />
      {groupName}
    </div>
    <div className={style.head}>
      <div className={style.text}>
        <div className={`bigCircle ${level}`} />
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
export default MiddleBar;

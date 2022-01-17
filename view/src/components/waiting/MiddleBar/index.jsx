import UserInfo from "./UserInfo";
import TeacherInfo from "./TeacherInfo";
import Info from "./Info";
import style from "./style.module.scss";

const MiddleBar = ({
  level,
  groupName,
  courseName,
  teacherInfo,
  ...otherProps
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
    <UserInfo {...{ ...otherProps }} />
    <TeacherInfo teacherInfo={teacherInfo} />
  </div>
);
export default MiddleBar;

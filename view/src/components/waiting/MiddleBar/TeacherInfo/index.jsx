import teacher from "../../../../assets/img/teacher.png";
import Info from "../Info";
import style from "./style.module.scss";

const TeacherInfo = ({ teacherInfo }) => (
  <div className={style.teacherInfo}>
    <div className={style.profile}>
      <div className={style.about}>
        <div className={style.pic}>
          <img src={teacher} alt="" />
        </div>
        <div className={style.aboutInfo}>
          <span className={style.name}>
            {teacherInfo.name + " " + teacherInfo.surname}
          </span>
          <div className={style.rating}>
            <div className={style.stars}></div>
            <div className={style.rate}>{"( " + teacherInfo.stars + " )"}</div>
          </div>
          <span className={style.profession}>{teacherInfo.profession}</span>
        </div>
      </div>
      <div className={style.info}>
        <Info text={"students"} count={teacherInfo.students} type="medium" />
        <Info text={"follower"} count={teacherInfo.followers} type="medium" />
        <Info text={"friend"} count={teacherInfo.friends} type="medium" />
      </div>
    </div>
    <div className={style.description}>
      <p>{teacherInfo.description}</p>
    </div>
    <div className={style.infoBar}>
      <Info
        text={"videoCourses"}
        count={teacherInfo.videoCourses}
        type="large"
      />
      <Info
        text={"onlineLessons"}
        count={teacherInfo.onlineLessons}
        type="large"
      />
      <Info text={"conference"} count={teacherInfo.conference} type="large" />
      <Info text={"liveStream"} count={teacherInfo.liveStream} type="large" />
    </div>
  </div>
);

export default TeacherInfo;

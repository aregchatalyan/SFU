import teacher from "../../../../assets/img/teacher.png";
import { Rating } from "../../../theme/Icons";
import Info from "../Info/Info";
import "./style.scss";

export default function TeacherInfo({ teacherInfo }) {
  return (
    <div className="teacherInfo">
      <div className="profile">
        <div className="about">
          <div className="pic">
            <img src={teacher} alt="" />
          </div>
          <div className="aboutInfo">
            <span className="name">
              {teacherInfo.name + " " + teacherInfo.surname}
            </span>
            <div className="rating">
              <div className="stars">
                <Rating isActive={true} />
                <Rating isActive={true} />
                <Rating isActive={true} />
                <Rating isActive={true} />
                <Rating />
              </div>
              <div className="rate">{"( " + teacherInfo.stars + " )"}</div>
            </div>
            <span className="profession">{teacherInfo.profession}</span>
          </div>
        </div>
        <div className="info">
          <Info text={"students"} count={teacherInfo.students} type="medium" />
          <Info text={"follower"} count={teacherInfo.followers} type="medium" />
          <Info text={"friend"} count={teacherInfo.friends} type="medium" />
        </div>
      </div>
      <div className="description">
        <p>{teacherInfo.description}</p>
      </div>
      <div className="infoBar">
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
}

import "./style.scss";
import user1 from "../../../assets/img/user1.png";
export default function Student({ info, withBorder }) {
  const { name, surname, grade, absentCount, attendingPercent } = info;
  return (
    <div className={`student ${withBorder ? "withShadow" : ""}`}>
      <div className="auth">
        <div className="pic">
          <img src={user1} alt={name + " " + surname + "photo"} />
        </div>
        <span className="name">{name + " " + surname}</span>
      </div>
      <ul className="studentInfo">
        <li className="grade">{grade}</li>
        <li className="absent">{absentCount}</li>
        <li className="attend">{attendingPercent}</li>
      </ul>
    </div>
  );
}

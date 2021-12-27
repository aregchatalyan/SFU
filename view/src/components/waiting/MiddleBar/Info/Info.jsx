import {
  Conference,
  Follower,
  Friends,
  OnlineLessons,
  Student,
  VideoCourse,
  LiveStream,
} from "../../../theme/Icons";
import "./style.scss";
export default function Info({ text, count, type, color }) {
  let res = null;
  let icon = null;
  let title = null;

  switch (text) {
    case "friend":
      icon = <Friends />;
      title = "Friends :";
      break;
    case "follower":
      icon = <Follower />;
      title = "Followers :";
      break;
    case "students":
      icon = <Student />;
      title = "Students :";
      break;
    case "videoCourses":
      icon = <VideoCourse />;
      title = "Video Courses :";
      break;
    case "onlineLessons":
      icon = <OnlineLessons />;
      title = "Online Lessons :";
      break;
    case "conference":
      icon = <Conference />;
      title = "Conferene :";
      break;
    case "liveStream":
      icon = <LiveStream />;
      title = "Live Stream :";
      break;
    default:
  }
  if (type === "medium") {
    res = (
      <div className="rows">
        <div className="rowName">
          {icon}
          <span>{title}</span>
        </div>
        <div className="rowCount">{count}</div>
      </div>
    );
  } else if (type === "large") {
    res = (
      <div className="rowsLarg">
        {icon}
        <div className="titleLarge">
          <span style={{ color: color || "black" }}>{title}</span>
        </div>
        <div className="count">{count}</div>
      </div>
    );
  }

  return res;
}

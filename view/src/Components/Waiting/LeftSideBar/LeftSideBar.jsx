import InsideBar from "./InsideBar/InsideBar";
import "./style.scss";

export function LeftSideBar({ level, group, lessons }) {
  return (
    <div className="leftSideBar">
      <InsideBar
        title={"This Group"}
        type={"level"}
        info={"Medium"}
        arr={group}
        level={level}
      />
      <InsideBar
        title={"Upcoming Lessons"}
        type={"text"}
        info={7}
        arr={lessons}
      />
    </div>
  );
}

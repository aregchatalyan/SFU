import "./style.scss";
import Student from "./Student";

export default function RightSideBar({ participants }) {
  const [me, ...classmates] = participants;
  return (
    <div className="rightSideBar">
      <h5 className="title"> My Information</h5>
      <Student info={me} />
      <h5 className="classmates"> Classmates</h5>
      {classmates.map((elm, index) => {
        return (
          <Student
            info={elm}
            key={index}
            withBorder={index < classmates.length - 1}
          />
        );
      })}
    </div>
  );
}

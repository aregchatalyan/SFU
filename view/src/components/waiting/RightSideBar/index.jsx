import Student from "./Student";
import style from "./style.module.scss";

export default function RightSideBar({ participants }) {
  const [me, ...classmates] = participants;
  return (
    <div className={style.rightSideBar}>
      <h5 className={style.title}> My Information</h5>
      <Student info={me} />
      <h5 className={style.classmates}> Classmates</h5>
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

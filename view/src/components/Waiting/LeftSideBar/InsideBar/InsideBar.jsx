import { ShowUsers } from "../../../theme/Icons";
import "./style.scss";
const InsideBar = ({ title, type, info, arr, level }) => {
  const infoText =
    type === "level" ? (
      <div className="level">
        <div className={`circle ${level ? level : "unset"}`}></div>
        <span>{info}</span>
      </div>
    ) : (
      <div className="level">
        <span>{info}</span>
      </div>
    );
  const head = (element) => {
    const { text, level } = element;
    return type === "level" ? (
      <div className="head">
        <div className="text">{text}</div>
      </div>
    ) : (
      <div className="head">
        <div className={`circle ${level ? level : "unset"}`}></div>
        <div className="textSmall">{text}</div>
      </div>
    );
  };

  return (
    <div className="insideBar">
      <div className="title">
        <h6>{title}</h6>
        {infoText}
      </div>
      <div className="container">
        {arr.map((element, key) => {
          return (
            <div className="content" key={key}>
              {head(element)}
              <div className="contentFooter">
                <div className="date">{element.date}</div>
                <div className="classMates">
                  <ShowUsers />
                  <span>7</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default InsideBar;

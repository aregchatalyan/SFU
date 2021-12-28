import { buttonTitle } from "../../constant";
import { FullScreeen, Home } from "../theme/Icons";
import "./buttonStyle.scss";

export const Button = ({ type, condition, method, opened }) => {
  let btn;
  let title;
  switch (type) {
    case "fullScreen":
      btn = <FullScreeen condition={condition} />;
      break;
    case "join":
      btn = buttonTitle.join;
      break;
    case "return":
      btn = <Home />;
      break;
    default:
      btn = <Home />;
  }
  return (
    <button
      title={title}
      className={
        type === "fullScreen"
          ? "fullScreenBtn"
          : type === "join"
          ? "join"
          : type === "return"
          ? "return"
          : `primary ${condition || type === "message" ? "" : "disabled"} ${
              opened ? "active" : ""
            } `
      }
      onClick={method}
    >
      {btn}
      {type === "return" ? "  " + buttonTitle.return : ""}
    </button>
  );
};

import { buttonTitle } from "../../constant";
import {
  ShowUsers,
  Exel,
  Word,
  Voice,
  Video,
  Message,
  HangUp,
  ScreenShare,
  Blackboard,
  Book,
  Request,
  Hand,
  FullScreeen,
  Home,
} from "../theme/Icons";
import "./buttonStyle.scss";

export const Button = ({ type, condition, method, opened }) => {
  let btn;
  let title;
  switch (type) {
    case "video":
      btn = <Video condition={condition} />;
      title = buttonTitle.video;
      break;
    case "voice":
      btn = <Voice condition={condition} />;
      title = buttonTitle.voice;

      break;
    case "message":
      btn = <Message condition={condition} />;
      title = buttonTitle.message;
      break;
    case "hangUp":
      btn = <HangUp />;
      title = buttonTitle.exit;
      break;
    case "screenShare":
      btn = <ScreenShare />;
      title = buttonTitle.share;
      break;
    case "blackboard":
      btn = <Blackboard />;
      title = buttonTitle.blackboard;
      break;
    case "book":
      btn = <Book />;
      title = buttonTitle.book;
      break;
    case "request":
      btn = <Request />;
      title = buttonTitle.request;
      break;
    case "hand":
      btn = <Hand />;
      title = buttonTitle.hand;
      break;
    case "showUser":
      btn = <ShowUsers />;
      title = buttonTitle.users;
      break;
    case "word":
      btn = <Word />;
      title = buttonTitle.word;
      break;
    case "exel":
      btn = <Exel />;
      title = buttonTitle.exel;
      break;
    case "fullScreen":
      btn = <FullScreeen condition={condition} />;
      break;
    case "join":
      btn = buttonTitle.join;
      break;
    case "return":
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
          : `primary ${condition || type == "message" ? "" : "disabled"} ${
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

import React from "react";
import style from "./style.module.scss";
import MassageConatiner from "./MassageContainer";

const Chat = ({ userId, massages }) => {
  return (
    <div className={style.msgContainer}>
      {massages.map(({ text, userId: msgWriter }, key) => {
        return (
          <MassageConatiner
            {...{ text, isMine: msgWriter === userId }}
            key={key}
          />
        );
      })}
    </div>
  );
};

export default Chat;

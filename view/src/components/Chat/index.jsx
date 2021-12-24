import React, { useState } from "react";
import Icon from "../core/Icon";
import style from "./style.module.scss";
import MassageConatiner from "./MassageContainer";

const Chat = ({ className, socket, userId, massages }) => {
  const [inputValue, setInputValue] = useState("");
  return (
    <div className={className}>
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
      <div className={style.actionBar}>
        <div className={style.textAreaWrapper}>
          <textarea
            value={inputValue}
            onChange={({ target: { value } }) => setInputValue(value)}
          />
        </div>
        <button className={style.smiles}>
          <Icon name="add_smiles" width={24} height={24} />
        </button>
        <button
          className={style.sendButton}
          onClick={() => {
            socket.emit("addMassage", { userId, text: inputValue });
            setInputValue("");
          }}
        >
          <Icon name="send_msg" width={24} height={24} />
        </button>
      </div>
    </div>
  );
};

export default Chat;

import React, { useState } from "react";
import Icon from "../Icon";
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
        {/* <MassageConatiner text={"hello world"} isMine={false} />
        <MassageConatiner text={"hello world"} isMine={false} />
        <MassageConatiner
          text={"At out office 3 ppl are infected. We work from home."}
          isMine={true}
        />
        <MassageConatiner text={"hello world"} isMine={true} />
        <MassageConatiner text={"hello world"} isMine={true} />
        <MassageConatiner text={"hello world"} isMine={false} />
        <MassageConatiner text={"hello world"} isMine={false} />
        <MassageConatiner
          text={
            "hello world kajsdh askdfjasldf laksdjfasdf alskdfjas  alskdjafsdf  "
          }
          isMine={true}
        /> */}
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

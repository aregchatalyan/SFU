import React from "react";
import { ArrowRight, ChatIcon } from "../theme/Icons";
import style from "./style.module.scss";

const Chat = ({ className, showChat }) => {
  return (
    <div className={className}>
      <div className={style.chatConatiner}>
        <div className={style.header}>
          <div className={style.headerContent}>
            <div className={style.content}>
              <ChatIcon />
              <span>Messages</span>
            </div>
            <button onClick={showChat}>
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

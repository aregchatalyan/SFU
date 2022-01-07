import React, { useState } from "react";
import Icon from "../Icon";
import Answer from "./answer";
import style from "./style.module.scss";

const Question = ({ question, answers, isAnswered }) => {
  const [isOpened, setisOpened] = useState(false);
  return (
    <div className={style.questionWrapper}>
      <div className={style.questionComponenet}>
        <span>{question}</span>
        <button
          className={isOpened ? style.openedBtn : style.closedBtn}
          onClick={() => setisOpened(!isOpened)}
        >
          <Icon name="open_variant" width={24} height={24} />
        </button>
      </div>
      <div className={isOpened ? style.answerBarOpen : style.answerBarClose}>
        {answers.map((elm, key) => (
          <Answer key={key} {...{ isAnswered, ...elm }} />
        ))}
      </div>
    </div>
  );
};

export default Question;

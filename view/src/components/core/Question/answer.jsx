import React from "react";
import CheckBox from "../Input/CheckBox";
import style from "./style.module.scss";

const Answer = ({ isVoted, isAnswered, label, percentage }) => {
  return (
    <div className={style.answerWrapper}>
      <div className={style.answerContainer}>
        {isAnswered ? (
          isVoted ? (
            <CheckBox {...{ label, checked: isVoted, disable: true }} />
          ) : (
            <span className={style.answerText}>{label}</span>
          )
        ) : (
          <CheckBox {...{ label }} />
        )}
        {isAnswered && (
          <div
            className={style.percentageLine}
            style={{ width: `${percentage}%` }}
          />
        )}
        {isAnswered && (
          <span className={style.percentage}>{`${percentage} %`}</span>
        )}
      </div>
      <div className={isAnswered ? style.votesOpen : style.votesHide}>
        <span>Voters :</span>
        <div className={style.votersWrapper}> hello</div>
      </div>
    </div>
  );
};

export default Answer;

import React from "react";
import CheckBox from "../Input/CheckBox";
import user from "../../../assets/img/user1.png";
import style from "./style.module.scss";

const Answer = ({
  isVoted,
  isAnswered,
  label,
  percentage,
  onSelect,
  anonymus,
  votes,
}) => (
  <div className={style.answerWrapper}>
    <div className={style.answerContainer}>
      {isAnswered ? (
        isVoted ? (
          <CheckBox {...{ label, checked: isVoted, disable: true }} />
        ) : (
          <span className={style.answerText}>{label}</span>
        )
      ) : (
        <CheckBox {...{ label, onSelect }} />
      )}
      {isAnswered && (
        <div
          className={style.percentageLine}
          style={{ width: `${percentage}%` }}
        />
      )}
      {isAnswered && (
        <div className={style.percentage}>
          <span>{`${percentage} %`}</span>
        </div>
      )}
    </div>
    <div
      className={isAnswered && !anonymus ? style.votesOpen : style.votesHide}
    >
      <span>Voters :</span>
      <div className={style.votersWrapper}>
        {!anonymus && votes && votes.length > 0
          ? votes.map((id, key) => (
              <div key={key} className={style.voterImg}>
                <img src={user} alt="" />
              </div>
            ))
          : 0}
      </div>
    </div>
  </div>
);

export default Answer;

import React, { useState, memo } from "react";
import Answer from "./answer";
import Icon from "../Icon";
import style from "./style.module.scss";

const Question = ({
  question,
  versions,
  isAnswered,
  onVersionSelect,
  anonymus,
}) => {
  const [isOpened, setisOpened] = useState(false);
  return (
    <div className={style.questionWrapper}>
      <button
        className={style.questionComponenet}
        onClick={() => setisOpened(!isOpened)}
      >
        <span>{question}</span>
        <div className={isOpened ? style.opened : style.closed}>
          <Icon name="open_variant" width={24} height={24} />
        </div>
      </button>
      <div className={isOpened ? style.answerBarOpen : style.answerBarClose}>
        {versions.map(
          ({ id, text: label, isVoted, percentage, votes }, key) => (
            <Answer
              key={key}
              {...{
                isAnswered,
                label,
                isVoted,
                percentage,
                anonymus,
                onSelect: onVersionSelect(id),
                votes,
              }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default memo(Question);

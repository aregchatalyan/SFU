import React from "react";
import Icon from "../core/Icon";
import useModalWithButton from "../core/Modal/index";
import Question from "../core/Question";
import style from "./style.module.scss";

export { useCreatePollModal } from "./useCreatePoll";

const Children = ({ polls, closeModal, userId, socket }) => {
  const handleVote = (questionId) => (versionId) => () => {
    console.log(`questionId`, questionId);
    socket.emit("votePoll", { userId, questionId, versionId });
  };

  return (
    <div className={style.pollContainer}>
      <div className={style.header}>
        <span>All Polls</span>
        <button onClick={closeModal} className={style.closeBtn}>
          <Icon name="close_poll_modal" width={24} height={24} />
        </button>
      </div>
      <div className={style.qusetionsContainer}>
        {polls.map(({ id, text: question, ...otherProps }, key) => (
          <Question
            {...{
              question,
              onVersionSelect: handleVote(id),
              ...otherProps,
            }}
            key={key}
          />
        ))}
      </div>
    </div>
  );
};

const usePollModal = ({ polls, userId, socket }) =>
  useModalWithButton({
    child: ({ closeModal }) => (
      <Children {...{ polls, closeModal, userId, socket }} />
    ),
    modalProps: {
      className: style.pollModalContainer,
    },
    buttonProps: {
      children: (
        <>
          <Icon name="all_poll" width={21} height={20} />
          <span>All</span>
        </>
      ),
      className: style.buttonStyle,
    },
  });
export default usePollModal;

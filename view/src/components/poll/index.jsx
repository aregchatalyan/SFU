import React from "react";
import Icon from "../core/Icon";
import useModalWithButton from "../core/Modal/index";
import Question from "../core/Question";
import style from "./style.module.scss";

export { useCreatePollModal } from "./useCreatePoll";

const question =
  "Are you agree that Univern is the most popular Education website";

const answers = [
  { label: "Yes", answerId: "1", isVoted: true, percentage: 60 },
  { label: "No", answerId: "2", percentage: 30 },
  { label: "I don't know", answerId: "3", percentage: 10 },
];

const Children = ({ closeModal }) => {
  return (
    <div className={style.pollContainer}>
      <div className={style.header}>
        <span>All Polls</span>
        <button onClick={closeModal} className={style.closeBtn}>
          <Icon name="close_poll_modal" width={24} height={24} />
        </button>
      </div>
      <div className={style.qusetionsContainer}>
        <Question {...{ question, answers, isAnswered: true }} />
        <Question {...{ question, answers }} />
        <Question {...{ question, answers }} />
        <Question {...{ question, answers }} />
        <Question {...{ question, answers }} />
        <Question {...{ question, answers }} />
        <Question {...{ question, answers }} />
        <Question {...{ question, answers }} />
        <Question {...{ question, answers }} />
        <Question {...{ question, answers }} />
      </div>
    </div>
  );
};

const usePollModal = () =>
  useModalWithButton({
    child: ({ closeModal }) => <Children closeModal={closeModal} />,
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

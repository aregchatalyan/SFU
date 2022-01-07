import React from "react";
import Icon from "../core/Icon";
import TextArea from "../core/Input/TextArea";
import useModalWithButton from "../core/Modal";
import style from "./style.module.scss";

const Children = ({ closeModal }) => {
  return (
    <div className={style.pollContainer}>
      <div className={style.header}>
        <span>Create a Poll</span>
        <button onClick={closeModal} className={style.closeBtn}>
          <Icon name="close_poll_modal" width={24} height={24} />
        </button>
      </div>
      <div className={style.createQuestion}>
        <TextArea />
      </div>
    </div>
  );
};

export const useCreatePollModal = () =>
  useModalWithButton({
    child: ({ closeModal }) => <Children closeModal={closeModal} />,
    modalProps: {
      className: style.pollModalContainer,
    },
    buttonProps: {
      children: (
        <>
          <Icon name="create_poll" width={21} height={20} />
          <span>Create</span>
        </>
      ),
      className: style.buttonStyle,
    },
  });

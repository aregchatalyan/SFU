import React from "react";
import Icon from "../core/Icon";
import useModalWithButton from "../core/Modal/index";
import style from "./style.module.scss";

const Children = () => {
  return (
    <div className={style.pollContainer}>
      <div className={style.header}>
        <span>All Polls</span>
        <Icon name="close_poll_modal" width={24} height={24} />
      </div>
      <div className={style.qusetionsContainer}> hello</div>
    </div>
  );
};

const PollModal = () => {
  const [Modal, openPollModal, closePollModal] = useModalWithButton({
    children: () => Children,
    modalProps: {
      className: style.pollModalContainer,
    },
  });
  return <div>{Modal}</div>;
};

export default PollModal;

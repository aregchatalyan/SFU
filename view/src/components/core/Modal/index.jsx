import React, { useState } from "react";
import Modal from "./modal";
import Icon from "../Icon";

export { useModalWithCallback } from "./useModalWithCallback";

const useModalWithButton = ({ child, modalProps, buttonProps = {} }) => {
  const [visible, setVisible] = useState(false);

  // handlers;
  const closeModal = () => setVisible(false);
  const button = {
    onClick: () => setVisible(!visible),
    visible,
    buttonProps,
  };

  return [
    <Modal visible={visible} {...modalProps}>
      {child({ closeModal })}
    </Modal>,
    button,
    closeModal,
  ];
};

export default useModalWithButton;

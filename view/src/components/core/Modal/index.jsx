import React, { useState } from "react";
import Modal from "./modal";

export { useModalWithCallback } from "./useModalWithCallback";

const useModalWithButton = ({ children, modalProps, buttonProps = {} }) => {
  const [visible, setVisible] = useState(true);

  // handlers;
  const closeModal = () => setVisible(false);
  const openModal = () => setVisible(true);

  return [
    <Modal visible={visible} {...modalProps}>
      {children({ closeModal })}
    </Modal>,
    openModal,
    closeModal,
  ];
};

export default useModalWithButton;

import React, { memo } from "react";
import style from "./style.module.scss";

const Modal = ({ visible, children, ...modalProps }) => {
  return (
    <div className={visible ? style.modalContainer : style.modalContainerHide}>
      <div {...modalProps}>{children}</div>
    </div>
  );
};
export default memo(Modal);

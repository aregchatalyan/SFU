import React, { memo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "./style.module.scss";

const Toast = () => <ToastContainer className={style.toast} />;

export default memo(Toast);

export const toastify = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    className: style.toastBody,
    bodyClassName: style.bodyClass,
  });
};

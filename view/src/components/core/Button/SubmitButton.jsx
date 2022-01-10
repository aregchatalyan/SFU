import React from "react";
import style from "./style.module.scss";

const SubmitButton = ({ disabled = false, onClick, text }) => {
  return (
    <button
      className={disabled ? style.submitDisabled : style.submit}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      {text}
    </button>
  );
};

export default SubmitButton;

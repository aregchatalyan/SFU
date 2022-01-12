import React from "react";
import Icon from "../Icon";
import style from "./style.module.scss";

export const ButtonWithTextAndIcon = ({ active, onClick, iconName, text }) => {
  return (
    <button
      onClick={onClick}
      style={{ cursor: "pointer" }}
      className={
        active ? style.buttonWithIconAndTextActive : style.buttonWithIconAndText
      }
    >
      <Icon name={iconName} width={24} height={24} />
      <span>{text}</span>
    </button>
  );
};

import React from "react";
import Icon from "../Icon";
import style from "./style.module.scss";

export const ButtonWithTextAndIcon = ({
  active,
  onClick,
  iconName,
  text,
  className,
  width,
  height,
}) => {
  return (
    <button
      onClick={onClick}
      style={{ cursor: "pointer" }}
      className={
        className
          ? className
          : active
          ? style.buttonWithIconAndTextActive
          : style.buttonWithIconAndText
      }
    >
      <Icon
        name={iconName}
        width={width ? width : 24}
        height={height ? height : 24}
      />
      <span>{text}</span>
    </button>
  );
};

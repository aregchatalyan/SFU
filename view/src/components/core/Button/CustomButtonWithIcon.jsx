import React from "react";
import Icon from "../Icon";
import style from "./style.module.scss";

export const CustomButtonWithIcon = ({
  onClick,
  className,
  iconName,
  width,
  height,
}) => {
  return (
    <div className={className}>
      <button onClick={onClick} className={style.customButtonWithIcon}>
        <Icon name={iconName} {...{ width, height }} />
      </button>
    </div>
  );
};

import React from "react";
import Icon from "../../Icon";
import style from "./style.module.scss";

export const CircleButtonWhithStates = ({ onClick, state, iconName }) => {
  return (
    <button
      onClick={onClick}
      className={
        state ? style.circleButtonWithStateActive : style.circleButtonWithState
      }
    >
      <Icon name={iconName} width={24} height={24} />
    </button>
  );
};

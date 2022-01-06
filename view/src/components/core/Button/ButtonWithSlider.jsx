import React from "react";
import Icon from "../Icon";
import style from "./style.module.scss";

export const ButtonWithSlider = ({ text, iconName }) => {
  return (
    <div className={style.sliderWrapper}>
      <div className={style.buttons}>
        <button>
          <Icon name="all_poll" width={21} height={20} />
          <span>All</span>
        </button>
        <button>
          <Icon name="create_poll" width={21} height={20} />
          <span>Create</span>
        </button>
      </div>
      <div className={style.text}>
        <Icon name={iconName} width={24} height={24} />
        <span>{text}</span>
      </div>
    </div>
  );
};

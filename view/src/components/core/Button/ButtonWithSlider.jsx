import React from "react";
import Icon from "../Icon";
import style from "./style.module.scss";

export const ButtonWithSlider = ({ text, iconName, buttons }) => {
  return (
    <div className={style.sliderWrapper}>
      <div className={style.buttons}>
        {buttons.map(({ onClick, buttonProps, cb }, key) => (
          <button
            onClick={() => {
              onClick();
              cb();
            }}
            key={key}
            {...buttonProps}
          />
        ))}
      </div>
      <div className={style.text}>
        <Icon name={iconName} width={24} height={24} />
        <span>{text}</span>
      </div>
    </div>
  );
};

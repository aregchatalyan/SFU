import React, { memo } from "react";
import Icon from "../Icon";
import style from "./style.module.scss";

const ButtonWithSlider = ({ text, iconName, buttons, cb: closeOthers }) => {
  return (
    <div className={style.sliderWrapper}>
      <div className={style.buttons}>
        {buttons.map(({ onClick, buttonProps, cb }, key) => (
          <button
            onClick={() => {
              onClick();
              cb();
              closeOthers();
            }}
            key={key}
            {...buttonProps}
            style={{ cursor: "pointer" }}
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
export default memo(ButtonWithSlider);

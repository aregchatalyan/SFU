import React, { useRef } from "react";
import { useComponentHover } from "../../../../hooks/useComponenetHover";
import Icon from "../../Icon";
import style from "./style.module.scss";

export const CircleButtonWithHover = ({
  onClick,
  iconName,
  children,
  state,
  handlFix,
  showLocker,
  opened,
  closed,
  locked,
  unLocked,
}) => {
  const hoverRef = useRef(null);
  const isHovered = useComponentHover(hoverRef);
  return (
    <div ref={hoverRef}>
      <div className={isHovered || state ? opened : closed}>
        {children}
        {showLocker && (
          <button className={state ? locked : unLocked} onClick={handlFix}>
            <Icon
              name={state ? "massagebar_locked" : "massagebar_lock"}
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
      <button
        onClick={onClick}
        className={
          isHovered || state
            ? style.circleButtonWithHoverActive
            : style.circleButtonWithHover
        }
      >
        <Icon name={iconName} width={24} height={24} />
      </button>
    </div>
  );
};

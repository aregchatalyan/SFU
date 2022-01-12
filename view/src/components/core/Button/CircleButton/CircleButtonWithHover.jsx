import React, { useRef } from "react";
import { useEffect } from "react";
import { useComponentHover } from "../../../../hooks/useComponenetHover";
import Icon from "../../Icon";
import style from "./style.module.scss";

export const CircleButtonWithHover = ({
  onClick,
  iconName,
  children,
  state,
  handlFix,
  isChatFixed,
  showLocker,
  opened,
  closed,
  locked,
  unLocked,
  isSubBarOpened,
  setisSubBarOpened,
}) => {
  const hoverRef = useRef(null);
  const [isHovered, setIsHovered] = useComponentHover(hoverRef);

  useEffect(
    () => setisSubBarOpened && setisSubBarOpened(isHovered),
    [isHovered, setisSubBarOpened]
  );

  return (
    <div ref={hoverRef} onClick={() => setIsHovered(false)}>
      <div
        className={(isHovered || state) && !isSubBarOpened ? opened : closed}
      >
        {children}
        {showLocker && (
          <button
            className={isChatFixed ? locked : unLocked}
            onClick={handlFix}
            style={{ cursor: "pointer" }}
          >
            <Icon
              name={isChatFixed ? "massagebar_locked" : "massagebar_lock"}
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
      <button
        onClick={onClick}
        style={{ cursor: "pointer" }}
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

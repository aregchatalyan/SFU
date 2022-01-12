import React from "react";
import Icon from "../../Icon";

export const CircleButtonCustom = ({
  onClick,
  iconName,
  className,
  width,
  height,
}) => {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{ cursor: "pointer" }}
    >
      <Icon name={iconName} width={width} height={height} />
    </button>
  );
};

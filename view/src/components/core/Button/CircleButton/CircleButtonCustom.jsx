import React from "react";
import Icon from "../../Icon";

export const CircleButtonCustom = ({ onClick, iconName, className }) => {
  return (
    <button onClick={onClick} className={className}>
      <Icon name={iconName} width={24} height={24} />
    </button>
  );
};

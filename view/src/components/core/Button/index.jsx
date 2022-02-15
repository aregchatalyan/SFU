import React, { memo } from "react";

export { default as CustomButtonWithIcon } from "./CustomButtonWithIcon";
export { default as ButtonWithTextAndIcon } from "./ButtonWithTextAndIcon";
export { default as ButtonWithSlider } from "./ButtonWithSlider";

const CustomButton = ({ onClick, text, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{ cursor: "pointer" }}
    >
      {text ? text : children}
    </button>
  );
};

export default memo(CustomButton);

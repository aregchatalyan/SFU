import React, { memo } from "react";

export { default as GradeInput } from "./GradeInput";

const CustomInput = ({ className, inputValue, setInputValue }) => {
  return (
    <input
      value={inputValue}
      className={className}
      onChange={({ target: { value } }) => setInputValue(value)}
    />
  );
};

export default memo(CustomInput);

import React from "react";

export { GradeInput } from "./GradeInput";

const CustomInput = ({ className, inputValue, setInputValue }) => {
  return (
    <input
      value={inputValue}
      className={className}
      onChange={({ target: { value } }) => setInputValue(value)}
    />
  );
};

export default CustomInput;

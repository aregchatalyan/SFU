import React, { useState } from "react";

const TextArea = ({
  cols = "30",
  rows = "10",
  placeholder = "Placeholder",
}) => {
  const [inputValue, setInputValue] = useState();
  return (
    <textarea
      {...{ cols, rows, value: inputValue, placeholder }}
      onChange={({ target: { value } }) => setInputValue(value)}
    />
  );
};

export default TextArea;

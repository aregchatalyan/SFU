import React, { useState } from "react";

const TextArea = ({
  cols = "30",
  rows = "10",
  placeholder = "Placeholder",
  className,
  name,
  context,
  changeContext,
}) => {
  return (
    <textarea
      {...{ cols, rows, value: context[name], placeholder, className }}
      onChange={({ target: { value } }) => {
        changeContext((state) => ({ ...state, [name]: value }));
      }}
    />
  );
};

export default TextArea;

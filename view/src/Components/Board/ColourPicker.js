import React, { useEffect } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import "./theme/toolBoard.scss";
const ColourPicker = ({ setColorWidth }) => {
  const [color, setColor] = useColor("hex", "#121212");
  useEffect(() => {
    setColorWidth(color);
  }, [color]);

  return (
    <div className="colorPicker">
      <ColorPicker
        width={window.innerWidth * 0.073 * 2}
        height={window.innerWidth * 0.073 * 2}
        color={color}
        onChange={setColor}
        hideHSB
        dark
      />
    </div>
  );
};
export default ColourPicker;

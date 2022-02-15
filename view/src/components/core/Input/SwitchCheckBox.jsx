import React, { memo } from "react";
import style from "./style.module.scss";

const SwitchCheckBox = ({ name, context, setContext, label }) => {
  return (
    <button
      className={style.switchCheckBoxContainer}
      onClick={() =>
        setContext((state) => ({ ...state, [name]: !context[name] }))
      }
    >
      <div
        className={style.switchCheckBoxWrapper}
        style={
          context[name]
            ? { background: "#ED2A26", border: 0, cursor: "pointer" }
            : { cursor: "pointer" }
        }
      >
        <div
          className={style.circle}
          style={context[name] ? { transform: "translateX(29px)" } : {}}
        />
      </div>
      {label && <span>{label}</span>}
    </button>
  );
};

export default memo(SwitchCheckBox);

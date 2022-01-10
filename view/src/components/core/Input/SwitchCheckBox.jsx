import React from "react";
import style from "./style.module.scss";

const SwitchCheckBox = ({ name, context, setContext, label }) => {
  return (
    <div className={style.switchCheckBoxContainer}>
      <button
        onClick={() =>
          setContext((state) => ({ ...state, [name]: !context[name] }))
        }
        className={style.switchCheckBoxWrapper}
        style={context[name] ? { background: "#ED2A26", border: 0 } : {}}
      >
        <div
          className={style.circle}
          style={
            context[name] ? { transform: "translateX(30px)", top: "2px" } : {}
          }
        />
      </button>
      {label && <span>{label}</span>}
    </div>
  );
};

export default SwitchCheckBox;

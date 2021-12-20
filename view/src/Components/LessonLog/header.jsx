import React from "react";
import style from "./style.module.scss";

const Header = () => {
  return (
    <div className={style.header}>
      <div className={style.leftPart}></div>
      <div className={style.middlePart}></div>
      <div className={style.rightPart}></div>
    </div>
  );
};
export default Header;

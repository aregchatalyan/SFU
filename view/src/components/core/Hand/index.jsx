import React, { memo } from "react";
import hand from "../../../assets/img/handUp.png";
import userPic from "../../../assets/img/user1.png";

import style from "./style.module.scss";

const Hand = ({ userId }) => {
  return (
    <div className={style.handWrapper}>
      <img src={hand} alt="hand" />
      <div className={style.userImg}>
        <img src={userPic} alt="name" />
      </div>
    </div>
  );
};
export default memo(Hand);

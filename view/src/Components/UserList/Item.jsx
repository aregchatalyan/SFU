import React from "react";
import { DefaultUser, LittleVideoOff, LiitMicrophoneOff } from "../theme/Icons";
import style from "./style.module.scss";
const Item = ({ isVideoOn }) => {
  return (
    <div className={style.item}>
      <div className={style.container}>
        <div className={style.imgWrapper}>
          <DefaultUser />
        </div>
        <span>Tigran Petrosyan</span>
      </div>
      <div className={style.accsessories}>
        {!isVideoOn && <LittleVideoOff />}
        <LiitMicrophoneOff />
      </div>
    </div>
  );
};

export default Item;

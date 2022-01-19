import React from "react";
import defaultUser from "../../assets/img/defaultUser.png";
import Icon from "../core/Icon";
import Visulizer from "../core/Visualizer";
import style from "./style.module.scss";

const Item = ({ isVideoOn, itemAudioStream }) => {
  return (
    <div className={style.item}>
      <div className={style.container}>
        <div className={style.imgWrapper}>
          <img src={defaultUser} alt="" />
        </div>
        <span>Tigran Petrosyan</span>
      </div>
      <div className={style.accsessories}>
        {!isVideoOn && (
          <Icon name="userlist_video_off" width={32} height={32} />
        )}
        {itemAudioStream ? // <Visulizer {...{ audioStream: itemAudioStream }} />
        null : (
          <Icon name="userlist_voice_off" width={32} height={36} />
        )}
      </div>
    </div>
  );
};

export default Item;

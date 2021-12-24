import React from "react";
import { useState } from "react";
import { VideoCall } from "../Board/theme/svg";
import Icon from "../core/Icon";
import style from "./style.module.scss";

const Header = ({ goToVideoCall, getLogsByIndex, handleFullScreen }) => {
  const [index, setIndex] = useState(0);
  return (
    <div className={style.header}>
      <div className={style.leftPart}>
        <button onClick={goToVideoCall}>
          <VideoCall />
        </button>
        <div className={style.monthPicker}>
          <Icon name="arrow_left" width={24} height={24} />
          <span>December</span>
          <Icon name="arrow_right" width={24} height={24} />
        </div>
      </div>
      <div className={style.middlePart}>
        <span>LessonLog</span>
      </div>
      <div className={style.rightPart}>
        <div className={style.datePicker}>
          <div
            className={
              index === 0 ? style.dateWrapperActive : style.dateWrapper
            }
            onClick={() => {
              getLogsByIndex(0);
              setIndex(0);
            }}
          >
            <span>1-10</span>
          </div>
          <div
            className={
              index === 1 ? style.dateWrapperActive : style.dateWrapper
            }
            onClick={() => {
              getLogsByIndex(1);
              setIndex(1);
            }}
          >
            <span>11-20</span>
          </div>
          <div
            className={
              index === 2 ? style.dateWrapperActive : style.dateWrapper
            }
            onClick={() => {
              getLogsByIndex(2);
              setIndex(2);
            }}
          >
            <span>21-31</span>
          </div>
        </div>
        <button onClick={handleFullScreen}>
          <Icon name="full_screen" width={24} height={24} />
        </button>
      </div>
    </div>
  );
};
export default Header;

import React, { useEffect, useRef } from "react";
import { useAudioAnalizer } from "../../../hooks";
import style from "./style.module.scss";

const Visulizer = ({ audioStream }) => {
  const getHeight = (sum) => `${parseInt((sum * 20) / 255)}px`;
  const firstLine = useRef(null);
  const secondLine = useRef(null);
  const thirdLine = useRef(null);
  const dataArray = useAudioAnalizer(audioStream);

  useEffect(() => {
    let sum = 0;
    dataArray.forEach((item, index) => {
      sum += item;
      if (index === 5) {
        firstLine.current.style.height = getHeight(item);
        sum = 0;
      } else if (index === 8) {
        secondLine.current.style.height = getHeight(item);
        sum = 0;
      } else if (index === 12) {
        thirdLine.current.style.height = getHeight(item);
        sum = 0;
      } else if (index === dataArray.length - 1) {
        sum = 0;
      }
    });
  }, [dataArray]);

  return (
    <>
      {audioStream && dataArray && (
        <div className={style.vizualizerWrapper}>
          <div className={style.firstLine} ref={firstLine} />
          <div className={style.secondLine} ref={secondLine} />
          <div className={style.thirdLine} ref={thirdLine} />
        </div>
      )}
    </>
  );
};

export default Visulizer;

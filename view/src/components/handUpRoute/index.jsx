import React from "react";
import { useEffect } from "react";
import Hand from "../core/Hand";
import style from "./style.module.scss";

const HandUpRoute = ({ hands, setHands }) => {
  //   useEffect(() => {
  //     let timeout;
  //     if (hands.length > 0) {
  //       clearTimeout(timeout);
  //       timeout = setTimeout(
  //         () =>
  //           setHands((state) => {
  //             const rest = [...hands];
  //             rest.shift();
  //             return [...rest];
  //           }),
  //         4000
  //       );
  //     } else {
  //       clearTimeout(timeout);
  //     }
  //   }, [hands, setHands]);
  return (
    <div className={style.route}>
      {hands.map(({ userId }, key) => (
        <Hand {...{ userId, key }} />
      ))}
    </div>
  );
};

export default HandUpRoute;

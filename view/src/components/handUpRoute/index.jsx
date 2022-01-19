import React from "react";
import Hand from "../core/Hand";
import style from "./style.module.scss";

const HandUpRoute = ({ hands }) => (
  <div
    className={style.route}
    style={hands?.length > 0 ? {} : { display: "none" }}
  >
    {hands.map(({ userId }, key) => (
      <Hand {...{ userId, key }} />
    ))}
  </div>
);

export default HandUpRoute;

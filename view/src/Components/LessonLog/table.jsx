import React from "react";
import moment from "moment";

import style from "./style.module.scss";

const today = new Date().setHours(0, 0, 0, 0);
const Table = ({ lessonDays, lessonLogData, start, end }) => {
  return (
    <div className={style.table}>
      <div className={style.thead}>
        <div className={style.logTitle}>Lesson Log</div>
        {lessonDays
          .filter(({ interval }) => interval >= start && interval <= end)
          .map(({ interval }) => {
            const weekDay = moment(interval).format("ddd");
            const day = moment(interval).format("DD");

            return (
              <div className={style.titles}>
                <span className={style.weekDay}>{weekDay}</span>
                <span className={style.day}>{day}</span>
              </div>
            );
          })}
      </div>
      <div className={style.tbody}>
        {lessonLogData.map(({ fullName, grades }, index) => (
          <div className={style.row} key={index}>
            <div className={style.studentInfo}>
              <div className={style.studentPhoto}></div>
              <span className={style.studentName}>{fullName}</span>
            </div>
            {grades
              .filter(({ interval }) => interval >= start && interval <= end)
              .map(({ grade, interval }, key) => (
                <div
                  className={
                    today === interval
                      ? index === 0
                        ? style.todaysAtomsTop
                        : index === lessonLogData.length - 1
                        ? style.todaysAtomsBottom
                        : style.todaysAtoms
                      : style.atoms
                  }
                  style={key === 0 ? { boxShadow: "none" } : {}}
                  key={key}
                >
                  <span
                    className={
                      grade === "A"
                        ? style.absend
                        : grade === "P"
                        ? style.present
                        : style.grade
                    }
                  >
                    {grade}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;

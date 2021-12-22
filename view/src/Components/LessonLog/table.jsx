import React from "react";
import moment from "moment";

import style from "./style.module.scss";
import Icon from "../Icon";
import { GradeInput } from "../Input";

const today = 1639958400000;

const CommentBox = ({ commentText }) => {
  return (
    <div className={style.commentBox}>
      <div className={style.commentWrapper}>{commentText}</div>
      <div className={style.pointer} />
    </div>
  );
};

const Table = ({ lessonDays, lessonLogData, start, end, isTeacher }) => {
  return (
    <div className={style.table}>
      <div className={style.thead}>
        <div className={style.logTitle}>Grade Book</div>
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
        {lessonLogData.map(({ name, surname, img, grades }, index) => (
          <div className={style.row} key={index}>
            <div className={style.studentInfo}>
              <div className={style.studentPhoto}>
                {img ? (
                  <img src={img} alt={name} />
                ) : (
                  <Icon name="default_profile_small" width={40} height={40} />
                )}
              </div>
              <span
                className={style.studentName}
                style={index === 0 ? { boxShadow: "none" } : {}}
              >
                {name + " " + surname}
              </span>
            </div>
            {grades
              .filter(({ interval }) => interval >= start && interval <= end)
              .map(({ grade, interval, comment }, key) => {
                return (
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
                    style={
                      index === 0
                        ? key === 0
                          ? { boxShadow: "none" }
                          : { boxShadow: "inset 1px 0px 0px #e7e7e7" }
                        : key === 0
                        ? { boxShadow: "inset 0px 1px 0px #e7e7e7" }
                        : {}
                    }
                    key={key}
                  >
                    <GradeInput
                      {...{
                        isTeacher: isTeacher && today === interval,
                        grade,
                        comment,
                      }}
                      className={
                        grade === "A"
                          ? style.absend
                          : grade === "P" || !grade
                          ? style.present
                          : style.grade
                      }
                    />
                    {/* {isTeacher && today === interval ? (
                      <>
                        <input
                          type="tel"
                          placeholder={grade}
                          className={
                            grade === "A"
                              ? style.absend
                              : grade === "P" || !grade
                              ? style.present
                              : style.grade
                          }
                          style={{ textAlign: "center" }}
                        />
                      </>
                    ) : (
                      <>
                        <span
                          className={
                            grade === "A"
                              ? style.absend
                              : grade === "P" || !grade
                              ? style.present
                              : style.grade
                          }
                        >
                          {grade}
                        </span>
                        {comment && (
                          <div className={style.commentBar}>
                            <CommentBox commentText={comment} />
                            <Icon name={"comment_log"} width={16} height={16} />
                          </div>
                        )}
                      </>
                    )} */}
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;

import React, { useState } from "react";
import Icon from "../Icon";
import style from "./style.module.scss";

const CommentBox = ({ commentText }) => {
  return (
    <div className={style.commentBox}>
      <div className={style.commentWrapper}>{commentText}</div>
      <div className={style.pointer} />
    </div>
  );
};

export const GradeInput = ({ className, grade, isTeacher, comment }) => {
  const [gradeValue, setGradeValue] = useState("");

  return (
    <>
      {isTeacher && grade !== "A" ? (
        <input
          type="tel"
          className={
            grade === "A"
              ? style.absend
              : grade === "P" || !grade
              ? style.present
              : style.grade
          }
          value={gradeValue}
          onChange={({ target: { value } }) => setGradeValue(value)}
        />
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
      )}
    </>
  );
};

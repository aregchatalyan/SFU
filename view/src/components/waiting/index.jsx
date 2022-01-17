import React, { memo } from "react";
import LeftSideBar from "./LeftSideBar";
import MiddleBar from "./MiddleBar";
import RightSideBar from "./RightSideBar";
import "./style.scss";

const courseName =
  "UI /UX Design : Prototyping and Design system and something else";
const groupName =
  "UI /UX Design : Prototyping and Design system and something else";
const level = "medium";
const group = [
  {
    text: "Machine Learning A-Z : Hands-On Python & R in Science",
    date: "December 10 / 16:40",
  },
  {
    text: "The Python Mega Course:Build 10 Real World Applications",
    date: "July 9 / 16:40",
  },
  {
    text: "The Python Mega Course:Build 10 Real World Applications",
    date: "September 20 / 16:40",
  },
  {
    text: "Machine Learning A-Z : Hands-On Python & R in Science",
    date: "October 5 / 16:40",
  },
];
const lessons = [
  {
    text: "Machine Learning A-Z : Hands-On Python & R in Science",
    date: "December 10 / 16:40",
    level: "professional",
  },
  {
    text: "The Python Mega Course:Build 10 Real World Applications",
    date: "July 9 / 16:40",
    level: "medium",
  },
  {
    text: "The Python Mega Course:Build 10 Real World Applications",
    date: "September 20 / 16:40",
    level: "beginner",
  },
  {
    text: "Machine Learning A-Z : Hands-On Python & R in Science",
    date: "October 5 / 16:40",
  },
];
const teacherInfo = {
  name: "Anushik",
  surname: "Hakobyan",
  stars: 4,
  profession: "UI/UX Designer",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit a ultrices donec quam sed id rrying an smethung else and for expmle you will learn everthing during this course and will get important information about JavaScrip",
  videoCourses: 8,
  onlineLessons: 6,
  conference: 6,
  liveStream: 5,
};
const participants = [
  {
    name: "Khachatur ",
    surname: "Arukyan",
    grade: "9",
    absentCount: "2",
    attendingPercent: "92%",
  },
  {
    name: "Artur ",
    surname: "Xachatryan",
    grade: "10",
    absentCount: "1",
    attendingPercent: "98%",
  },
  {
    name: "Maria ",
    surname: "Vloeva",
    grade: "9",
    absentCount: "1",
    attendingPercent: "95%",
  },
  {
    name: "Tigran ",
    surname: "Petrosyan",
    grade: "9",
    absentCount: "2",
    attendingPercent: "92%",
  },
  {
    name: "Areg ",
    surname: "Chatalyan",
    grade: "8",
    absentCount: "3",
    attendingPercent: "90%",
  },
  {
    name: "Lucy ",
    surname: "Shegunc ",
    grade: "8",
    absentCount: "2",
    attendingPercent: "88%",
  },
  {
    name: "Hasmik ",
    surname: "Karapetyan",
    grade: "7",
    absentCount: "1",
    attendingPercent: "85%",
  },
  {
    name: "Jon  ",
    surname: "Smith",
    grade: "7",
    absentCount: "4",
    attendingPercent: "84%",
  },
  {
    name: "Irina ",
    surname: "Nikalayeva",
    grade: "6",
    absentCount: "3",
    attendingPercent: "73%",
  },
  {
    name: "Suren ",
    surname: "Khachatryan",
    grade: "5",
    absentCount: "3",
    attendingPercent: "72%",
  },
];

const Waiting = ({ ...props }) => {
  return (
    <div className="fullScreen">
      <LeftSideBar level={level} group={group} lessons={lessons} />
      <MiddleBar
        level={level}
        groupName={groupName}
        courseName={courseName}
        teacherInfo={teacherInfo}
        {...{ ...props }}
      />
      <RightSideBar participants={participants} />
    </div>
  );
};

export default memo(Waiting);

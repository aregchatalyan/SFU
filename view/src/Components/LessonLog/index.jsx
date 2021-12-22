import React, { useState } from "react";
import ClassMates from "./classMates";
import Header from "./header";
import Table from "./table";

import style from "./style.module.scss";
import first from "../../assets/img/user1.png";
import second from "../../assets/img/user2.png";
import third from "../../assets/img/user3.png";

const seperate = [
  [1638302400000, 1639094400000],
  [1639180800000, 1639958400000],
  [1640044800000, 1640908800000],
];

const lessonDays = [
  {
    interval: 1638388800000,
  },
  {
    interval: 1638561600000,
  },
  {
    interval: 1638734400000,
  },
  {
    interval: 1638907200000,
  },
  {
    interval: 1639094400000,
  },
  {
    interval: 1639267200000,
  },
  {
    interval: 1639440000000,
  },
  {
    interval: 1639612800000,
  },
  {
    interval: 1639958400000,
  },
  {
    interval: 1640131200000,
  },
  {
    interval: 1640476800000,
  },
  {
    interval: 1640822400000,
  },
  {
    interval: 1640908800000,
  },
];

const lessonLogData = [
  {
    id: "123",
    name: "Khachatur ",
    surname: "Arukyan",
    grade: "9",
    absentCount: "2",
    attendingPercent: "92%",
    img: first,
    avrg: 35,
    grades: [
      {
        interval: 1638388800000,
        grade: 8,
      },
      {
        interval: 1638561600000,
        grade: "P",
      },
      {
        interval: 1638734400000,
        grade: "P",
      },
      {
        interval: 1638907200000,
        grade: "A",
      },
      {
        interval: 1639094400000,
        grade: "P",
      },
      {
        interval: 1639267200000,
        grade: 10,
      },
      {
        interval: 1639440000000,
        grade: 8,
        comment: "Good job !",
      },
      {
        interval: 1639612800000,
        grade: 7,
      },
      {
        interval: 1639958400000,
      },
      {
        interval: 1640131200000,
      },
      {
        interval: 1640476800000,
      },
      {
        interval: 1640822400000,
      },
      {
        interval: 1640908800000,
      },
    ],
  },
  {
    id: "1234",
    name: "Artur ",
    surname: "Xachatryan",
    grade: "10",
    absentCount: "1",
    attendingPercent: "98%",
    img: undefined,
    avrg: 35,
    grades: [
      {
        interval: 1638388800000,
        grade: 8,
      },
      {
        interval: 1638561600000,
        grade: "P",
      },
      {
        interval: 1638734400000,
        grade: "P",
      },
      {
        interval: 1638907200000,
        grade: "A",
      },
      {
        interval: 1639094400000,
        grade: "P",
      },
      {
        interval: 1639267200000,
        grade: 10,
      },
      {
        interval: 1639440000000,
        grade: 8,
      },
      {
        interval: 1639612800000,
        grade: 7,
        comment: "Helloooooooooooooo men, realy good job.",
      },
      {
        interval: 1639958400000,
      },
      {
        interval: 1640131200000,
      },
      {
        interval: 1640476800000,
      },
      {
        interval: 1640822400000,
      },
      {
        interval: 1640908800000,
      },
    ],
  },
  {
    id: "12345",
    name: "Maria ",
    surname: "Vloeva",
    grade: "9",
    absentCount: "1",
    attendingPercent: "95%",
    img: second,
    avrg: 47,
    grades: [
      {
        interval: 1638388800000,
        grade: 8,
      },
      {
        interval: 1638561600000,
        grade: "P",
      },
      {
        interval: 1638734400000,
        grade: "P",
      },
      {
        interval: 1638907200000,
        grade: "A",
      },
      {
        interval: 1639094400000,
        grade: "P",
      },
      {
        interval: 1639267200000,
        grade: 10,
      },
      {
        interval: 1639440000000,
        grade: 8,
      },
      {
        interval: 1639612800000,
        grade: 7,
      },
      {
        interval: 1639958400000,
      },
      {
        interval: 1640131200000,
      },
      {
        interval: 1640476800000,
      },
      {
        interval: 1640822400000,
      },
      {
        interval: 1640908800000,
      },
    ],
  },
  {
    id: "123456",
    name: "Tigran ",
    surname: "Petrosyan",
    grade: "9",
    absentCount: "2",
    attendingPercent: "92%",
    img: third,
    avrg: 69,
    grades: [
      {
        interval: 1638388800000,
        grade: 8,
      },
      {
        interval: 1638561600000,
        grade: "P",
      },
      {
        interval: 1638734400000,
        grade: "P",
      },
      {
        interval: 1638907200000,
        grade: "A",
      },
      {
        interval: 1639094400000,
        grade: "P",
      },
      {
        interval: 1639267200000,
        grade: 10,
        comment: "Fine !",
      },
      {
        interval: 1639440000000,
        grade: 8,
      },
      {
        interval: 1639612800000,
        grade: 7,
      },
      {
        interval: 1639958400000,
      },
      {
        interval: 1640131200000,
      },
      {
        interval: 1640476800000,
      },
      {
        interval: 1640822400000,
      },
      {
        interval: 1640908800000,
      },
    ],
  },
  {
    id: "1234567",
    name: "Areg ",
    surname: "Chatalyan",
    grade: "8",
    absentCount: "3",
    attendingPercent: "90%",
    img: second,
    avrg: 93,
    grades: [
      {
        interval: 1638388800000,
        grade: 8,
      },
      {
        interval: 1638561600000,
        grade: "P",
      },
      {
        interval: 1638734400000,
        grade: "P",
      },
      {
        interval: 1638907200000,
        grade: "A",
      },
      {
        interval: 1639094400000,
        grade: "P",
      },
      {
        interval: 1639267200000,
        grade: 10,
      },
      {
        interval: 1639440000000,
        grade: 8,
      },
      {
        interval: 1639612800000,
        grade: 7,
      },
      {
        interval: 1639958400000,
      },
      {
        interval: 1640131200000,
      },
      {
        interval: 1640476800000,
      },
      {
        interval: 1640822400000,
      },
      {
        interval: 1640908800000,
      },
    ],
  },
  {
    id: "12345678",
    name: "Lucy ",
    surname: "Shegunc ",
    grade: "8",
    absentCount: "2",
    attendingPercent: "88%",
    img: undefined,
    avrg: 26,
    grades: [
      {
        interval: 1638388800000,
        grade: 8,
      },
      {
        interval: 1638561600000,
        grade: "P",
      },
      {
        interval: 1638734400000,
        grade: "P",
      },
      {
        interval: 1638907200000,
        grade: "A",
      },
      {
        interval: 1639094400000,
        grade: "P",
      },
      {
        interval: 1639267200000,
        grade: 10,
      },
      {
        interval: 1639440000000,
        grade: 8,
      },
      {
        interval: 1639612800000,
        grade: 7,
        comment: "Shame on you!",
      },
      {
        interval: 1639958400000,
      },
      {
        interval: 1640131200000,
      },
      {
        interval: 1640476800000,
      },
      {
        interval: 1640822400000,
      },
      {
        interval: 1640908800000,
      },
    ],
  },
  {
    id: "123456789",
    name: "Hasmik ",
    surname: "Karapetyan",
    grade: "7",
    absentCount: "1",
    attendingPercent: "85%",
    img: third,
    avrg: 21,
    grades: [
      {
        interval: 1638388800000,
        grade: 8,
      },
      {
        interval: 1638561600000,
        grade: "P",
      },
      {
        interval: 1638734400000,
        grade: "P",
      },
      {
        interval: 1638907200000,
        grade: "A",
      },
      {
        interval: 1639094400000,
        grade: "P",
      },
      {
        interval: 1639267200000,
        grade: 10,
      },
      {
        interval: 1639440000000,
        grade: 8,
      },
      {
        interval: 1639612800000,
        grade: 7,
      },
      {
        interval: 1639958400000,
      },
      {
        interval: 1640131200000,
      },
      {
        interval: 1640476800000,
      },
      {
        interval: 1640822400000,
      },
      {
        interval: 1640908800000,
      },
    ],
  },
  {
    id: "12345678910",
    name: "Jon  ",
    surname: "Smith",
    grade: "7",
    absentCount: "4",
    attendingPercent: "84%",
    img: first,
    avrg: 100,
    grades: [
      {
        interval: 1638388800000,
        grade: 8,
      },
      {
        interval: 1638561600000,
        grade: "P",
      },
      {
        interval: 1638734400000,
        grade: "P",
      },
      {
        interval: 1638907200000,
        grade: "A",
      },
      {
        interval: 1639094400000,
        grade: "P",
      },
      {
        interval: 1639267200000,
        grade: 10,
      },
      {
        interval: 1639440000000,
        grade: 8,
      },
      {
        interval: 1639612800000,
        grade: 7,
      },
      {
        interval: 1639958400000,
      },
      {
        interval: 1640131200000,
      },
      {
        interval: 1640476800000,
      },
      {
        interval: 1640822400000,
      },
      {
        interval: 1640908800000,
      },
    ],
  },
  {
    id: "1234567891011",
    name: "Irina ",
    surname: "Nikalayeva",
    grade: "6",
    absentCount: "3",
    attendingPercent: "73%",
    img: undefined,
    avrg: 43,
    grades: [
      {
        interval: 1638388800000,
        grade: 8,
      },
      {
        interval: 1638561600000,
        grade: "P",
      },
      {
        interval: 1638734400000,
        grade: "P",
      },
      {
        interval: 1638907200000,
        grade: "A",
      },
      {
        interval: 1639094400000,
        grade: "P",
      },
      {
        interval: 1639267200000,
        grade: 10,
      },
      {
        interval: 1639440000000,
        grade: 8,
      },
      {
        interval: 1639612800000,
        grade: 7,
      },
      {
        interval: 1639958400000,
      },
      {
        interval: 1640131200000,
      },
      {
        interval: 1640476800000,
      },
      {
        interval: 1640822400000,
      },
      {
        interval: 1640908800000,
      },
    ],
  },
  {
    id: "123456789101112",
    name: "Suren ",
    surname: "Khachatryan",
    grade: "5",
    absentCount: "3",
    attendingPercent: "72%",
    img: second,
    avrg: 69,
    grades: [
      {
        interval: 1638388800000,
        grade: 8,
      },
      {
        interval: 1638561600000,
        grade: "P",
      },
      {
        interval: 1638734400000,
        grade: "P",
      },
      {
        interval: 1638907200000,
        grade: "A",
      },
      {
        interval: 1639094400000,
        grade: "P",
      },
      {
        interval: 1639267200000,
        grade: 10,
      },
      {
        interval: 1639440000000,
        grade: 8,
      },
      {
        interval: 1639612800000,
        grade: 7,
      },
      {
        interval: 1639958400000,
      },
      {
        interval: 1640131200000,
      },
      {
        interval: 1640476800000,
      },
      {
        interval: 1640822400000,
      },
      {
        interval: 1640908800000,
      },
    ],
  },
];
const LessonLog = ({
  className,
  goToVideoCall,
  handleFullScreen,
  userId,
  logRef,
  wrapperRef,
  isTeacher,
}) => {
  const [[start, end], setTimeInterval] = useState(seperate[0]);
  const getLogsByIndex = (index) => {
    setTimeInterval(seperate[index]);
  };
  return (
    <div className={className}>
      <Header {...{ goToVideoCall, getLogsByIndex, handleFullScreen }} />
      <div className={style.lessonLog} ref={wrapperRef}>
        <div className={style.log} ref={logRef}>
          <Table {...{ lessonDays, lessonLogData, start, end, isTeacher }} />
          <ClassMates {...{ lessonLogData, userId, isTeacher }} />
        </div>
      </div>
    </div>
  );
};

export default LessonLog;

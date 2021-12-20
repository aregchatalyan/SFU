import React, { useState } from "react";
import Header from "./header";
import style from "./style.module.scss";
import Table from "./table";

const seperate = {
  first: [1638302400000, 1639094400000],
  second: [1639180800000, 1639958400000],
  third: [1640044800000, 1640908800000],
};

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
    fullName: "Suren Zakaryan",
    pic: "",
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
        grade: 9,
      },
      {
        interval: 1640131200000,
        grade: 8,
      },
      {
        interval: 1640476800000,
        grade: "P",
      },
      {
        interval: 1640822400000,
        grade: "A",
      },
      {
        interval: 1640908800000,
        grade: 8,
      },
    ],
  },
  {
    fullName: "Suren Zakaryan",
    pic: "",
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
        grade: 9,
      },
      {
        interval: 1640131200000,
        grade: 8,
      },
      {
        interval: 1640476800000,
        grade: "P",
      },
      {
        interval: 1640822400000,
        grade: "A",
      },
      {
        interval: 1640908800000,
        grade: 8,
      },
    ],
  },
  {
    fullName: "Suren Zakaryan",
    pic: "",
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
        grade: 9,
      },
      {
        interval: 1640131200000,
        grade: 8,
      },
      {
        interval: 1640476800000,
        grade: "P",
      },
      {
        interval: 1640822400000,
        grade: "A",
      },
      {
        interval: 1640908800000,
        grade: 8,
      },
    ],
  },
  {
    fullName: "Suren Zakaryan",
    pic: "",
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
        grade: 9,
      },
      {
        interval: 1640131200000,
        grade: 8,
      },
      {
        interval: 1640476800000,
        grade: "P",
      },
      {
        interval: 1640822400000,
        grade: "A",
      },
      {
        interval: 1640908800000,
        grade: 8,
      },
    ],
  },
  {
    fullName: "Suren Zakaryan",
    pic: "",
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
        grade: 9,
      },
      {
        interval: 1640131200000,
        grade: 8,
      },
      {
        interval: 1640476800000,
        grade: "P",
      },
      {
        interval: 1640822400000,
        grade: "A",
      },
      {
        interval: 1640908800000,
        grade: 8,
      },
    ],
  },
  {
    fullName: "Suren Zakaryan",
    pic: "",
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
        grade: 9,
      },
      {
        interval: 1640131200000,
        grade: 8,
      },
      {
        interval: 1640476800000,
        grade: "P",
      },
      {
        interval: 1640822400000,
        grade: "A",
      },
      {
        interval: 1640908800000,
        grade: 8,
      },
    ],
  },
  {
    fullName: "Suren Zakaryan",
    pic: "",
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
        grade: 9,
      },
      {
        interval: 1640131200000,
        grade: 8,
      },
      {
        interval: 1640476800000,
        grade: "P",
      },
      {
        interval: 1640822400000,
        grade: "A",
      },
      {
        interval: 1640908800000,
        grade: 8,
      },
    ],
  },
  {
    fullName: "Suren Zakaryan",
    pic: "",
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
        grade: 9,
      },
      {
        interval: 1640131200000,
        grade: 8,
      },
      {
        interval: 1640476800000,
        grade: "P",
      },
      {
        interval: 1640822400000,
        grade: "A",
      },
      {
        interval: 1640908800000,
        grade: 8,
      },
    ],
  },
  {
    fullName: "Suren Zakaryan",
    pic: "",
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
        grade: 9,
      },
      {
        interval: 1640131200000,
        grade: 8,
      },
      {
        interval: 1640476800000,
        grade: "P",
      },
      {
        interval: 1640822400000,
        grade: "A",
      },
      {
        interval: 1640908800000,
        grade: 8,
      },
    ],
  },
  {
    fullName: "Suren Zakaryan",
    pic: "",
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
        grade: 9,
      },
      {
        interval: 1640131200000,
        grade: 8,
      },
      {
        interval: 1640476800000,
        grade: "P",
      },
      {
        interval: 1640822400000,
        grade: "A",
      },
      {
        interval: 1640908800000,
        grade: 8,
      },
    ],
  },
];
const LessonLog = ({ className }) => {
  const [[start, end], settimeInterval] = useState(seperate.second);
  return (
    <div className={className}>
      <Header />
      <div className={style.lessonLog}>
        <div className={style.log}>
          <Table {...{ lessonDays, lessonLogData, start, end }} />

          <div className={style.classMates} />
        </div>
      </div>
    </div>
  );
};

export default LessonLog;

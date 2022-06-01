const { Schema, model } = require('mongoose');

const TeacherSchema = new Schema({
  id:               String,
  name:             String,
  surname:          String,
  stars:            Number,
  profession:       String,
  description:      String,
  videoCourses:     Number,
  onlineLessons:    Number,
  conference:       Number,
  liveStream:       Number,
});

const StudentSchema = new Schema({
  id:               String,
  name:             String,
  surname:          String,
  grade:            String,
  absentCount:      Number,
  attendingPercent: Number,
  img:              String,
  avg:              Number,

  grades: [{
    interval:       Number,
    grade:          String,
  }],

  courseName:       String,
  groupName:        String,
  level:            String,
});

const SignInSchema = new Schema({
  id:               String,
  teacher:          TeacherSchema,
  students:         [StudentSchema],
  startTime:        Date,
  duration:         Date,
}, {
  timestamps: { currentTime: () => Date.now() },
});

module.exports = model('SignIn', SignInSchema);
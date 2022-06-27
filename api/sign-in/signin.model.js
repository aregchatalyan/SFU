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
}, {
  _id: false
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
}, {
  _id: false
});

const SignInSchema = new Schema({
  id:               String,
  teacher:          TeacherSchema,
  students:         [StudentSchema],
  startTime:        Date,
  duration:         Date,
}, {
  versionKey:       false,
  timestamps:       { currentTime: () => Date.now() },
});

SignInSchema.set('toJSON', {
  virtuals:         true,
  transform:        (doc, ret) => { delete ret._id }
});

module.exports = model('SignIn', SignInSchema);
const { Schema, model } = require('mongoose');

const SignInSchema = new Schema({
  id: String,
  students: [],
  teacherId: String,
  startTime: Date,
  duration: Date,
}, {
  timestamps: { currentTime: () => Date.now() },
});

module.exports = model('SignIn', SignInSchema);
const { Schema, model } = require('mongoose');

const SignInSchema = new Schema({
  id: String,
  students: [],
  teachers: [],
  startTime: Date,
  duration: Date,
}, {
  timestamps: true,
});

module.exports = model('SignIn', SignInSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true, trim: true, lowercase: true},
  lastName: {type: String, required: true, trim: true, lowercase: true},
  userName: {type: String, required: true, trim: true, minLength: [3, 'Username must be at least 3 characters long']},
  email: {type: String, required: true, trim: true, match: [/^[0-9A-Za-z\.]{3,50}\@[A-Za-z]{2,30}\.[A-Za-z]{2,10}$/i, 'The email you provider does not match the pattern blabla@example.something']},
  password: {type: String, required: true}
}, {versionKey: false})

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;

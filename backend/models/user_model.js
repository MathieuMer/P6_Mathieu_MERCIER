const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trimp: true,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
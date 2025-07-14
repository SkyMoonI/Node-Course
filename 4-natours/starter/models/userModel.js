const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    trim: true,
    maxLength: [100, 'A user name must have less or equal then 40 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true, // this will convert email to lowercase. not check if it is a lowercase email.
    validate: [validator.isEmail, 'Please provide a valid email'], // calling the custom validator
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    maxLength: 64,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // the value of el is coming from entered value of the passwordConfirm field
      // this only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
});

// Encrypt password
// this will run before .save() and .create()
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  // this will not run if password is not modified
  // so we only want this function to encrypt the password
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  // cost of 12 is enough for these years
  // more of it will take more time, but it will be more secure
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field. Because we don't want to store it anymore.
  // it is only for validation at the beginning
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;

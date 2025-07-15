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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
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
  passwordChangedAt: Date,
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

// instance method: it will be available on all documents of this collection
// we can't use the this.password keyword here because it will point to the current document
// so schema variables are not available
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// instance method: it will be available on all documents of this collection
/**
 * Checks if the password was changed after the given JWT timestamp.
 * @param {number} JWTTimestamp - The timestamp of the JWT.
 * @returns {boolean} - Returns true if the password was changed after the JWT was issued, otherwise false.
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // console.log(this.passwordChangedAt, JWTTimestamp);
  if (this.passwordChangedAt) {
    // we are trying to convert the passwordChangedAt to a number
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    // console.log(
    //   'Token issued before password change:',
    //   JWTTimestamp < changedTimestamp,
    // );

    // if the date of the token is issued is less than the date of the password changed
    // that means password is changed after the token was issued
    return JWTTimestamp < changedTimestamp;
  }
  // false means not changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res, next) => {
  // we created the user with mongoose model. create func comes from mongoose
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // this is for jwt token generation
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token, // add token for user
    data: {
      user: newUser,
    },
  });
});
exports.signup = signup;

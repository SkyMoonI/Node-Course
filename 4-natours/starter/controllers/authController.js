const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const signup = catchAsync(async (req, res, next) => {
  // we created the user with mongoose model. create func comes from mongoose
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  // this is for jwt token generation
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token, // add token for user
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    // we want to immediately stop the function
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) check if user exists && password is correct
  // if the field is not selected, we need to add '+' select('+password')
  const user = await User.findOne({ email }).select('+password');

  // 401 is unauthorized
  // we need to use the correctPassword in the if statement
  // because if the user is not found, the user will be undefined and correctPassword will throw an error
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) if everything ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  // 1) getting token and check of it's there
  let token;

  // common practice is to send the token using http header with the request
  // we can access the header using req.headers
  // in the headers we create authorization for the token
  // and the token value should be started with Bearer and  separated by space
  //   authorization: 'Bearer asda;slfkas;dlk'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // we want to remove the 'Bearer ' from the token because we don't need it
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);
  // console.log(req.headers);

  // if there is no token send with the request. that means we are not logged in
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // 2) Verification token
  // ✅ This verifies if the token is real and not expired
  // ⏳ It waits for the result using await (since verify is async)
  // ⏳ `jwt.verify` normally uses callbacks, so we use `promisify` to make it awaitable
  // 🛡️ This step ensures the token is valid and not tampered with
  // 🔓 If the token is valid, we get the data inside it (e.g. user ID)
  // 🧾 The result `decoded` contains data like user ID and expiration
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3) Check if user still exists
  // Because user maybe deleted or changed his password
  // so we need to check if the user still exists
  // that means no one has changed the jason web token
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }
  // 5) Grant access to protected route
  req.user = currentUser; // now the user is available for the request for protected routes
  next();
});

/**
 * Middleware that restricts access to certain routes to certain roles.
 * @param {...string} roles - The roles that are allowed to access the route.
 * @returns {function} A middleware function that checks if the user has the required role.
 * 403 is forbidden
 */
const restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };

exports.signup = signup;
exports.login = login;
exports.protect = protect;
exports.restrictTo = restrictTo;

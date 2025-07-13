const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
// 1) MIDDLEWARE

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// this is a middleware to modify the request
// the data in the body is added to req.body
// if we don't use this. we can't access the req.body. it will be undefined
app.use(express.json());

// use the static files
app.use(express.static(`${__dirname}/public`));

// this is our own middleware
// this will be executed for every request
// if we don't use next(), the next middleware will not be executed and the request will be blocked
// also order of middleware is important because the middleware will be executed in the order they are added
// app.use((req, res, next) => {
//   console.log('Hello from the middleware!');

//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);

  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// this is a wildcard route. it will match any route
// this should be the last route
// Because after all the routes are matched, if no route is matched, this will be executed
// if we put before any route, it will be executed first, and the other routes will not be executed
// this will be the only response we get
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`, // req.originalUrl is the url of the request
  // });

  // // this just a custom error for testing
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'custom fail';
  // err.statusCode = 404;
  // // if next receives any arguments, this means there is an error, it will be passed to the next middleware
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;

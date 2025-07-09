const express = require('express');
const morgan = require('morgan');

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
app.use((req, res, next) => {
  console.log('Hello from the middleware!');

  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);

  next();
});

// 2) ROUTE HANDLERS
// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

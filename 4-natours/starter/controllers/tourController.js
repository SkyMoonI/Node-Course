// const fs = require('fs');
// const express = require('express');
const Tour = require('../models/tourModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// const tours = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`);
// const toursJSON = JSON.parse(tours);
// for testing
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// we will check the id with db
// const checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id === id);

//   // if (req.params.id > tours.length) {
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// 400 status is bad request
// for test
// const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       state: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

// middleware for top 5 cheap tours
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

// '/api/v1/tours' we can change the v1-v2-v3. If someone uses v1 after we update to v2, we don't want to break the API
// (req, res) => {} is called route handler
// tours is a resource in this API
// this get will give us all the tours
// const getAllTours = catchAsync(async (req, res, next) => {
//   // res.status(200).json({ status: 'success', data: { tours: toursJSON } });
//   // if the data is the same, we can just write name of the variable
//   // this is called jSend data specification
//   // results is optional. we don't have to write if we send 1 data
//   // res
//   //   .status(200)
//   //   .json({ status: 'success', results: tours.length, data: { tours } });

//   // try {
//   //   // BUILD QUERY
//   //   // 1A) FILTERING
//   //   // when we set a variable to another object, that new variable will be a reference to the original object
//   //   // so if we change the original object, the new variable will also change, and vice versa
//   //   // so we need a hardcopy of the original object
//   //   // const queryObj = { ...req.query };

//   //   // // we are excluding the page, sort, limit and fields from the query. beacuse we will handle them later
//   //   // const excludeFields = ['page', 'sort', 'limit', 'fields'];
//   //   // excludeFields.forEach((el) => delete queryObj[el]);

//   //   // console.log(req.query, queryObj);

//   //   // hardcoded query
//   //   // const tours = await Tour.find({
//   //   //   duration: 5,
//   //   //   difficulty: 'easy',
//   //   // });
//   //   // hardcoded query but with mongoose query
//   //   // const tours = await Tour.find()
//   //   //   .where('duration')
//   //   //   .equals(5)
//   //   //   .where('difficulty')
//   //   //   .equals('easy');

//   //   // 1B) Advanced Filtering
//   //   // { difficulty: 'easy', duration: { gte: '5' } } this is from the query object
//   //   // { difficulty: 'easy', duration: { $gte: 5 } } this is for mongoose. we have to convert to this format
//   //   // let queryStr = JSON.stringify(queryObj);
//   //   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//   //   // console.log(JSON.parse(queryStr));

//   //   // this is too simple
//   //   // req.query is a query string. makes the filtering easier
//   //   // .find(req.query) also returns a query object
//   //   // we have to give object to find not a string so we convert it
//   //   // let query = Tour.find(JSON.parse(queryStr));

//   //   // 2) SORTING
//   //   // if (req.query.sort) {
//   //   //   // sort('price ratingAverage') this is from the query string
//   //   //   const sortBy = req.query.sort.split(',').join(' '); // this is for the same sorting values.
//   //   //   query = query.sort(sortBy);
//   //   //   // console.log(sortBy);
//   //   // } else {
//   //   //   // this is a default sorting if no sort is given. -createdAt means sort by createdAt in descending order
//   //   //   // so the most recent tour will be first
//   //   //   query = query.sort('-createdAt');
//   //   // }

//   //   // 3) FIELD LIMITING
//   //   // if (req.query.fields) {
//   //   //   const fields = req.query.fields.split(',').join(' ');
//   //   //   query = query.select(fields);
//   //   // } else {
//   //   //   query = query.select('-__v'); // exclude the __v field
//   //   // }

//   //   // 4) PAGINATION
//   //   // const page = req.query.page * 1 || 1;
//   //   // const limit = req.query.limit * 1 || 100;
//   //   // const skip = (page - 1) * limit;

//   //   // // page=2&limit=10, 1-10 page 1, 11-20 page 2, etc
//   //   // query = query.skip(skip).limit(limit);

//   //   // if (req.query.page) {
//   //   //   const numTours = await Tour.countDocuments(); // number of the tours
//   //   //   if (skip >= numTours) throw new Error('This page does not exist'); // throw means stop the function and goes to the catch
//   //   // }

//   //   // EXECUTE QUERY
//   //   // query looks like query.sort().select().skip().limit()
//   //   // const tours = await query;

//   //   const features = new APIFeatures(Tour.find(), req.query)
//   //     .filter()
//   //     .sort()
//   //     .limitFields()
//   //     .paginate();
//   //   const tours = await features.query;

//   //   // SEND RESPONSE
//   //   res.status(200).json({
//   //     status: 'success',
//   //     results: tours.length,
//   //     data: {
//   //       tours,
//   //     },
//   //   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }

//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

const getAllTours = factory.getAll(Tour);

// this get will give us a specific tour
// could also get multiple params: /api/v1/tours/:id/:name/:price? '?' makes the parameter optional
// const getTour = catchAsync(async (req, res, next) => {
//   // console.log(req.params);
//   // const id = req.params.id * 1;
//   // const tour = tours.find((el) => el.id === id);
//   // res.status(200).json({
//   //   status: 'success',
//   //   data: {
//   //     tour,
//   //   },
//   // });

//   // try {
//   //   // Tour.findOne({ _id: req.params.id })
//   //   const tour = await Tour.findById(req.params.id);
//   //   res.status(200).json({
//   //     status: 'success',
//   //     data: {
//   //       tour,
//   //     },
//   //   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }

//   // Tour.findOne({ _id: req.params.id })
//   // populate is to show the users with guide role of the tour that are stored only with the id in the guides field
//   // don't forget that populate creates a query in the db
//   // we use the populate method only when we get a single tour
//   // we don't want to get all the reviews for all the tours
//   const tour = await Tour.findById(req.params.id).populate('reviews');

//   // this will throw an error if the tour is not found
//   // valid id but not found
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 400));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

const getTour = factory.getOne(Tour, { path: 'reviews' });

// we need a middleware to modify the request because express does not put the body data in the request
// we need next function in order to pass the error into the catchAsync fn.
// so that that error can be handled by the global error handler
// one more saying, async functions return a promise
// so basically if there is an error in the func, that promise will be rejected
// const createTour = catchAsync(async (req, res, next) => {
//   // console.log(req.body);
//   // const newId = tours[tours.length - 1].id + 1;
//   // // eslint-disable-next-line prefer-object-spread
//   // const newTour = Object.assign({ id: newId }, req.body); // this will add the id to the //{ id: newId, ...req.body }
//   // tours.push(newTour); // this will add the newTour to the tours array
//   // // we have to stringify the tours array because it is not a string
//   // // status 201 means created
//   // fs.writeFile(
//   //   `${__dirname}/dev-data/data/tours-simple.json`,
//   //   JSON.stringify(tours),
//   //   (err) => {
//   //     if (err) return res.status(404).json({ status: 'fail', message: err });
//   //     res.status(201).json({
//   //       status: 'success',
//   //       data: {
//   //         tour: newTour,
//   //       },
//   //     });
//   //   },
//   // );
//   // creating a new tour with instance
//   // model.prototype works with the instances
//   // const newTour = new Tour();
//   // newTour.save(); // it returns a promise

//   // if you send data that doesn't exist in the schema, it will be ignored.
//   // it only takes data that is in the schema from req.body. so be careful with the naming
//   // try {
//   //   // creating a new tour with create method right on the model itself
//   //   // it returns a promise
//   //   const newTour = await Tour.create(req.body);

//   //   res.status(201).json({
//   //     status: 'success',
//   //     data: {
//   //       tour: newTour,
//   //     },
//   //   });
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }

//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });
const createTour = factory.createOne(Tour);

// const updateTour = catchAsync(async (req, res, next) => {
//   // try {
//   //   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//   //     new: true, // returns the updated document
//   //     runValidators: true, // this will run the validators that we have in the schema
//   //   });

//   //   res.status(200).json({
//   //     status: 'success',
//   //     data: {
//   //       tour,
//   //     },
//   //   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }

//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true, // returns the updated document
//     runValidators: true, // this will run the validators that we have in the schema
//   });

//   // this will throw an error if the tour is not found
//   // valid id but not found
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 400));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

const updateTour = factory.updateOne(Tour);

// const deleteTour = catchAsync(async (req, res, next) => {
//   // try {
//   //   await Tour.findByIdAndDelete(req.params.id);

//   //   // we use status 204 because we don't want to send any data
//   //   // it means no content. that's why data is null
//   //   res.status(204).json({
//   //     status: 'success',
//   //     data: null,
//   //   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }

//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   // this will throw an error if the tour is not found
//   // valid id but not found
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 400));
//   }

//   // we use status 204 because we don't want to send any data
//   // it means no content. that's why data is null
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

const deleteTour = factory.deleteOne(Tour);

const getTourStats = catchAsync(async (req, res, next) => {
  // try {
  //   // aggregation pipeline is a bit like a query
  //   // in aggregation pipeline, we can manipulate the data and have a couple of different steps
  //   // so we pass in an array of stages
  //   // if we don't await the Tour.aggregate, it will return a promise, but not executed. try to see it in postman
  //   const stats = await Tour.aggregate([
  //     {
  //       $match: { ratingAverage: { $gte: 4.5 } }, // match is basically a filter, like a query. it will only return the documents that match the condition
  //     },
  //     {
  //       // group is basically a group by. it will group the documents by the field that we pass in. uses accumulator pattern
  //       // we can also use $sum, $avg, $min, $max, $push, $addToSet, $first, $last, $sample, $sort
  //       $group: {
  //         // _id: null, // id is null, because we want to group all the documents together
  //         // _id: '$ratingAverage',
  //         _id: { $toUpper: '$difficulty' }, // this will group the documents by the difficulty
  //         numTours: { $sum: 1 }, // it will act like a forEach and will add 1 to the numTours for each document
  //         numRatings: { $sum: '$ratingQuantity' },
  //         avgRating: { $avg: '$ratingAverage' },
  //         avgPrice: { $avg: '$price' },
  //         minPrice: { $min: '$price' },
  //         maxPrice: { $max: '$price' },
  //       },
  //     },
  //     {
  //       $sort: {
  //         avgPrice: 1, // this will sort the documents by the avgPrice in ascending order
  //       },
  //     },
  //     // {
  //     //   $match: { _id: { $ne: 'EASY' } }, // this will remove the EASY difficulty from the results}
  //     // },
  //   ]);

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       stats,
  //     },
  //   });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }

  // aggregation pipeline is a bit like a query
  // in aggregation pipeline, we can manipulate the data and have a couple of different steps
  // so we pass in an array of stages
  // if we don't await the Tour.aggregate, it will return a promise, but not executed. try to see it in postman
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } }, // match is basically a filter, like a query. it will only return the documents that match the condition
    },
    {
      // group is basically a group by. it will group the documents by the field that we pass in. uses accumulator pattern
      // we can also use $sum, $avg, $min, $max, $push, $addToSet, $first, $last, $sample, $sort
      $group: {
        // _id: null, // id is null, because we want to group all the documents together
        // _id: '$ratingAverage',
        _id: { $toUpper: '$difficulty' }, // this will group the documents by the difficulty
        numTours: { $sum: 1 }, // it will act like a forEach and will add 1 to the numTours for each document
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1, // this will sort the documents by the avgPrice in ascending order
      },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }, // this will remove the EASY difficulty from the results}
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  //   const year = req.params.year * 1; // because params is a string, we need to convert it to a number

  //   const plan = await Tour.aggregate([
  //     {
  //       $unwind: '$startDates', // this will unwind the startDates array, means it will expand it into individual documents
  //     },
  //     {
  //       // this will filter the documents that have startDates that are greater than or equal to the start date of the year
  //       // and less than or equal to the end date of the year
  //       $match: {
  //         startDates: {
  //           $gte: new Date(`${year}-01-01`),
  //           $lte: new Date(`${year}-12-31`),
  //         },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: { $month: '$startDates' }, // this will group the documents by the month of the start date
  //         numTourStarts: { $sum: 1 }, // this will add 1 to the numTourStarts for each document
  //         tours: { $push: '$name' }, // this will add the name of the tour to the tours array
  //       },
  //     },
  //     {
  //       $addFields: { month: '$_id' }, // this will add a month field to the document with the value of _id
  //     },
  //     {
  //       $project: {
  //         _id: 0, // this will remove the _id field from the document. 1 will keep the field
  //       },
  //     },
  //     {
  //       $sort: { numTourStarts: -1 }, // this will sort the documents by the numTourStarts in descending order
  //     },
  //     {
  //       $limit: 12, // this will limit the number of documents to 12
  //     },
  //   ]);

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       plan,
  //     },
  //   });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }

  const year = req.params.year * 1; // because params is a string, we need to convert it to a number

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // this will unwind the startDates array, means it will expand it into individual documents. Because there would be more than one start date
    },
    {
      // this will filter the documents that have startDates that are greater than or equal to the start date of the year
      // and less than or equal to the end date of the year
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // this will group the documents by the month of the start date
        numTourStarts: { $sum: 1 }, // this will add 1 to the numTourStarts for each document
        tours: { $push: '$name' }, // this will add the name of the tour to the tours array
      },
    },
    {
      $addFields: { month: '$_id' }, // this will add a month field to the document with the value of _id
    },
    {
      $project: {
        _id: 0, // this will remove the _id field from the document. 1 will keep the field
      },
    },
    {
      $sort: { numTourStarts: -1 }, // this will sort the documents by the numTourStarts in descending order
    },
    {
      $limit: 12, // this will limit the number of documents to 12
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

// module.exports = {
//   getAllTours,
//   getTour,
//   createTour,
//   updateTour,
//   deleteTour,
// };

exports.getAllTours = getAllTours;
exports.getTour = getTour;
exports.createTour = createTour;
exports.updateTour = updateTour;
exports.deleteTour = deleteTour;
// exports.checkID = checkID;
// exports.checkBody = checkBody;
exports.aliasTopTours = aliasTopTours;
exports.getTourStats = getTourStats;
exports.getMonthlyPlan = getMonthlyPlan;

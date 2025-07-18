const express = require('express');
const tourController = require('../controllers/tourController');
// const app = require('../app');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  // checkID,
  // checkBody,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = tourController;

const { protect, restrictTo } = authController;

// const { createReview } = reviewController;

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// this is called mounting a router
const router = express.Router();

// param middleware
// router.param('id', checkID);

// we can chain multiple middleware
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

// we use /:year in the route because the route is going to be /monthly-plan/2021 so that we can get the year data from the url
router.route('/monthly-plan/:year').get(getMonthlyPlan);

// post(checkBody, createTour) this is chaining multiple middleware funcs
// router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/').get(protect, getAllTours).post(createTour);
// first we protect the route
// restrictTo is for restricting access for deleting users
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/234fad4
// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;

const express = require('express');
const tourController = require('../controllers/tourController');
// const app = require('../app');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  // checkID,
  // checkBody,
} = tourController;

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// this is called mounting a router
const router = express.Router();

// param middleware
// router.param('id', checkID);

// post(checkBody, createTour) this is chaining multiple middleware funcs
// router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;

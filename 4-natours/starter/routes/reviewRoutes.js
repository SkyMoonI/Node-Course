const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const {
  getAllReviews,
  getReview,
  setTourUserIds,
  createReview,
  deleteReview,
  deleteReviewOwner,
  updateReview,
} = reviewController;

const { protect, restrictTo } = authController;

// Protect all routes after this middleware
const router = express.Router();

// this
router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;

const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

/**
 * Calculate the average rating for a given tour.
 * @param {ObjectId} tourId - The tour id
 * @returns {Promise<void>}
 * @static we called the static method to use aggregate method
 */
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // this points to the current model
  // we select the all the reviews of the tour id
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    // we save the statistics to the tour
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// this is for unique index to prevent duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// we use post because the document has not been saved yet
// in order to work the calcAverageRatings, we called it in post middleware
// because it points to the current model
reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
// they are shorthand for findOneAnd
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   // this points to the current query
//   // but we need the current document
//   // we can use findOne and wait for the query to execute
//   // so it will return the current document
//   // r is for review
//   this.r = await this.findOne();
//   console.log(this.r);
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function () {
//   // await this.findOne(); does NOT work here, query has already executed
//   await this.r.constructor.calcAverageRatings(this.r.tour);
// });

// this is the same as the above
reviewSchema.post(/^findOneAnd/, async (docs) => {
  await docs.constructor.calcAverageRatings(docs.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/234fad4

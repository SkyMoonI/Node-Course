const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// schema is like a blueprint for a document
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      // maxlength, minlength is a built-in validator
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // we can use extra validators
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // enum is a built-in validator. enum is only for strings, not for numbers.
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      // min, max is a built-in validator. min, max is not only for numbers, but also for dates.
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
      type: Number,
      // this is a custom validator. we need it because we want to check if the discount price is lower than the regular price
      // to ensure that the discount price is lower than the regular price
      // we have to return either true or false
      // this won't work on update operations
      // this only works on create/new operations
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price; // 100 < 200
        },
        // if the validator returns false, this message will be displayed
        // {VALUE} is a placeholder for the value that failed the validation. in this case, it is the discount price
        // {VALUE} has the same value as val
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    secretTour: { type: Boolean, default: false }, // we use this to hide the tour from the users
    slug: String, // we use slug to store the slug of the tour that we created in the pre middleware
  },
  {
    toJSON: { virtuals: true }, // returns the virtual properties
    toObject: { virtuals: true }, // returns the virtual properties
  },
);

// virtual properties are properties that are not stored in the database
// they are computed from other properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create(), but not before .insertMany()
// we call the next to run the next middleware
// this is also called a pre saved hook
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true }); // lower: true makes the slug lowercase
  next();
});

// // we can also crate more than one pre middleware
// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// // post middleware also has access to the document that was just saved
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE: is a middleware that runs before every query. this keyword won't be pointing to the current document anymore
// we can use this keyword to access the current query
// /^find/ means that the middleware will run for all find queries that start with find (e.g. find, findOne, findMany, findOrCreate, etc.)
// here in this case we are using it to hide the secret tours. Because we don't want to show the secret tours to the users
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); // $ne means not equal

  // this.start = Date.now(); // to get the time it took to execute the query
  next();
});

// and this is a post middleware that runs after every query
// tourSchema.post(/^find/, function (docs, next) {
//   // console.log(docs);

//   console.log(`Query took ${Date.now() - this.start} milliseconds!`); // to get the time it took to execute the query
//   next();
// });

// AGGREGATION MIDDLEWARE is a middleware that runs before every aggregation pipeline
tourSchema.pre('aggregate', function (next) {
  // this.pipeline() is an array that contains the aggregation pipeline
  // unshift is a method that adds a new element to the beginning of the array
  // $match is a mongodb operator that is used to match documents
  // this simple adds a filter to the aggregation pipeline
  // we could have add the match in the aggregation pipeline directly in the controller
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline()); // to get the aggregation pipeline
  next();
});

// model is like a class
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// // create an instance of the model that we created
// // create a document with the constructor
// const testTour = new Tour({
//   name: 'The Park Camper2',
//   rating: 4.7,
//   price: 497,
// });

// // save the document to the database using the .save() method
// // the .save() method returns a promise that resolves to the saved document
// // then catch the error
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => console.log('ERROR: ', err));

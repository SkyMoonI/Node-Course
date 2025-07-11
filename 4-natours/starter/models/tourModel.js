const mongoose = require('mongoose');

// schema is like a blueprint for a document
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: { type: Number, required: [true, 'A tour must have a duration'] },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingAverage: { type: Number, default: 4.5 },
  ratingQuantity: { type: Number, default: 0 },
  price: { type: Number, required: [true, 'A tour must have a price'] },
  priceDiscount: Number,
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
  secretTour: { type: Boolean, default: false },
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

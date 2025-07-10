const fs = require('fs');

// const tours = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`);
// const toursJSON = JSON.parse(tours);
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

const checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (req.params.id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

// 400 status is bad request
const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      state: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

// '/api/v1/tours' we can change the v1-v2-v3. If someone uses v1 after we update to v2, we don't want to break the API
// (req, res) => {} is called route handler
// tours is a resource in this API
// this get will give us all the tours
const getAllTours = (req, res) => {
  // res.status(200).json({ status: 'success', data: { tours: toursJSON } });
  // if the data is the same, we can just write name of the variable
  // this is called jSend data specification
  // results is optional. we don't have to write if we send 1 data
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
};

// this get will give us a specific tour
// could also get multiple params: /api/v1/tours/:id/:name/:price? '?' makes the parameter optional
const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// we need a middleware to modify the request because express does not put the body data in the request
const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  // eslint-disable-next-line prefer-object-spread
  const newTour = Object.assign({ id: newId }, req.body); // this will add the id to the //{ id: newId, ...req.body }

  tours.push(newTour); // this will add the newTour to the tours array

  // we have to stringify the tours array because it is not a string
  // status 201 means created
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return res.status(404).json({ status: 'fail', message: err });

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  // we use status 204 because we don't want to send any data
  // it means no content. that's why data is null
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

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
exports.checkID = checkID;
exports.checkBody = checkBody;

const fs = require('fs');
const express = require('express');

const app = express();

// this is a middleware to modify the request
// the data in the body is added to req.body
// if we don't use this. we can't access the req.body. it will be undefined
app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).json({
//     app: 'Natours',
//     status: 'success',
//     message: 'Hello from the server',
//   });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint');
// });

// '/api/v1/tours' we can change the v1-v2-v3. If someone uses v1 after we update to v2, we don't want to break the API
// (req, res) => {} is called route handler
// tours is a resource in this API
// this get will give us all the tours

// const tours = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`);
// const toursJSON = JSON.parse(tours);
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  // res.status(200).json({ status: 'success', data: { tours: toursJSON } });
  // if the data is the same, we can just write name of the variable
  // this is called jSend data specification
  // results is optional. we don't have to write if we send 1 data
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
});

// we need a middleware to modify the request because express does not put the body data in the request
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); // this will add the id to the req.body

  tours.push(newTour); // this will add the newTour to the tours array

  // we have to stringify the tours array because it is not a string
  // status 201 means created
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

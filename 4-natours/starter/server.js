const mongoose = require('mongoose');
const dotenv = require('dotenv');
// this has to be placed before the app file. If not, the app file will not be able to access the env variables
dotenv.config({ path: './config.env' });
const app = require('./app');

// we have to change the connection string to include the password.
// because we don't want to explicitly write the password in the config file
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

// connect to database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // (con) => {
    // console.log(con.connections);
    console.log('DB connection successful!');
  });

// express environment
// console.log(app.get('env'));
// node.js environment
// console.log(process.env);
console.log(process.env.NODE_ENV);

// 4) START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

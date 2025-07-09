const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

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

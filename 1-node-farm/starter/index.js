const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////
// FILES

// // Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR! 💥');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('Your file has been written 😁');
//       });
//     });
//   });
// });

// console.log("Will read file!");
/////////////////////////////////
// SERVER

// Reading file of data for the API before starting the server so that we don't have to wait for the file to be read
// And we don't have to read the file every time a request is made
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

// Reading data of the foods
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // convert string to object because data is a string. we can't do operations on strings easily

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

// Creating the server
const server = http.createServer((req, res) => {
  // query has the id. So we can use it to choose the product we want
  // We combine pathname with query to route to the correct page
  // query: 'id=1', pathname: '/product'
  const { query, pathname } = url.parse(req.url, true); // req.url has some attributes that we can use
  // console.log(req);
  console.log(url.parse(req.url));

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    // server response with a header with 200 status code (success) and content type
    res.writeHead(200, {
      'content-type': 'text/html',
    });

    // We use the replaceTemplate function to replace the placeholders with the data of the products in the data file
    // map loops through the each element of the data object that we read from the file and returns an array of strings
    // Then we join the array of strings into a single string
    const cardsHtml = dataObj
      .map((dataEl) => replaceTemplate(templateCard, dataEl))
      .join('');

    // We replace the cards placeholder with the cardsHtml string that we created
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    // We end the response with the output
    res.end(output);
  }

  // Product page
  else if (pathname === '/product') {
    // server response with a header with 200 status code (success) and content type
    res.writeHead(200, {
      'content-type': 'text/html',
    });

    // we bring the specific product data to display the product details
    const product = dataObj[query.id];

    // We use the replaceTemplate function to replace the placeholders with the data of the specific product
    const output = replaceTemplate(templateProduct, product);

    // We end the response with the output
    res.end(output);
  }

  // API
  else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);
  }

  // Not found
  else {
    // server response with a header with 404 status code (not found) and content type
    // we can also create a custom header content type
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'hello-world',
    });

    // We end the response with a simple html header
    res.end('<h1>Page not found!</h1>');
  }
});

// Starting the server
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});

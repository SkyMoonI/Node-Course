const fs = require("fs");
const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
  // Solution 1
  // we wait for the file to be read completely
  // then store the data in data variable
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });
  // Solution 2: Streams
  // we create read stream so that we can read the file in chunks
  // after we use data event to see coming data in chunks
  // every time we get a chunk we use write stream write it to the response
  // const readable = fs.createReadStream("test-file.txt");
  // readable.on("data", (chunk) => {
  //   res.write(chunk);
  // });
  // // and at the end we end the response and close the readable stream
  // // without this we would get an error or can't close the stream
  // readable.on("end", () => {
  //   res.end();
  // });
  // // if there is an error we close the readable stream
  // readable.on("error", (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end("File not found!");
  // });

  // Solution 3
  // we create read stream so that we can read the file in chunks
  const readable = fs.createReadStream("test-file.txt");
  // we pipe the readable stream to the response
  // so that we can write the data to the response
  // this helps us to reduce the latency between reading the file and writing it to the response
  // sometimes reading could be fast but writing could be slow
  // this is called back pressure
  // pipelining allows us to do both at the same time
  // this is called pipelining
  readable.pipe(res);
  // readableSource.pipe(writeableDest)
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});

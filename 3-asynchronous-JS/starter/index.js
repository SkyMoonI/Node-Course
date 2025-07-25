const fs = require('fs');
const superagent = require('superagent');

// the problem with callbacks is that it's a callback hell
// fs.readFile(`${__dirname}/dog.txt`, 'utf-8', (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body);
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log('Random dog image saved to file!');
//       });
//     });
// });

// the solution is to use promises
// instead of triangling callbacks
// we chain promises
// fs.readFile(`${__dirname}/dog.txt`, 'utf-8', (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body);
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log('Random dog image saved to file!');
//       });
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// the solution is to use promises
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) reject('I could not find that file 😢');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write file 😢');
      resolve('success');
    });
  });
};

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body);
//     console.log(res.body.message);

//     return writeFilePro('dog-img.txt', res.body.message);
//   })
//   .then(() => {
//     console.log('Random dog image saved to file!');
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// the solution is to use async/await
// const getDogPic = async () => {
//   try {
//     const data = await readFilePro(`${__dirname}/dog.txt`);
//     console.log(`Breed: ${data}`);

//     const res = await superagent.get(
//       `https://dog.ceo/api/breed/${data}/images/random`
//     );
//     console.log(res.body);
//     console.log(res.body.message);

//     await writeFilePro('dog-img.txt', res.body.message);
//     console.log('Random dog image saved to file!');
//   } catch (err) {
//     console.log(err);

//     throw err;
//   }
//   return '2: READY 🐶';
// };

// // returning values from async functions
// console.log('1: Will get dog pics!');
// // const x = getDogPic();
// // console.log(x);
// getDogPic()
//   .then((x) => {
//     console.log(x);
//     console.log('3: Done getting dog pics!');
//   })
//   .catch((err) => {
//     console.log('ERROR 💥');
//   });

// returning values from async functions with IIFE(Immediately Invoked Function Expression)
// (async () => {
//   try {
//     console.log('1: Will get dog pics!');
//     const x = await getDogPic();
//     console.log(x);
//     console.log('3: Done getting dog pics!');
//   } catch (err) {
//     console.log('ERROR 💥');
//   }
// })();

// waiting multiple promises simultaneously
// const getDogPic = async () => {
//   try {
//     const data = await readFilePro(`${__dirname}/dog.txt`);
//     console.log(`Breed: ${data}`);

//     // SOLUTION 1
//     // const res1Pro = superagent.get(
//     //   `https://dog.ceo/api/breed/${data}/images/random`
//     // );
//     // const res2Pro = superagent.get(
//     //   `https://dog.ceo/api/breed/${data}/images/random`
//     // );
//     // const res3Pro = superagent.get(
//     //   `https://dog.ceo/api/breed/${data}/images/random`
//     // );
//     // const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
//     // const imgs = all.map((el) => el.body.message);
//     // console.log(imgs);

//     // await writeFilePro('dog-img.txt', imgs.join('\n'));
//     // console.log('Random dog image saved to file!');

//     // SOLUTION 2
//     // const res = await Promise.all([
//     //   superagent.get(`https://dog.ceo/api/breed/${data}/images/random`),
//     //   superagent.get(`https://dog.ceo/api/breed/${data}/images/random`),
//     //   superagent.get(`https://dog.ceo/api/breed/${data}/images/random`),
//     // ]);

//     // const imgs = res.map((el) => el.body.message);
//     // console.log(imgs);

//     // await writeFilePro('dog-img.txt', imgs.join('\n'));
//     // console.log('Random dog image saved to file!');
//   } catch (err) {
//     console.log(err);

//     throw err;
//   }
//   return '2: READY 🐶';
// };

// (async () => {
//   try {
//     console.log('1: Will get dog pics!');
//     const x = await getDogPic();
//     console.log(x);
//     console.log('3: Done getting dog pics!');
//   } catch (err) {
//     console.log('ERROR 💥');
//   }
// })();

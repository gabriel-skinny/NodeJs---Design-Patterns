import fs from "fs";

function promisify(callBackFunc) {
  return function promisified(...args) {
    return new Promise((resolve, reject) => {
      const newArgs = [
        ...args,
        function (err, data) {
          if (err) return reject(err);

          resolve(data);
        },
      ];

      callBackFunc(...newArgs);
    });
  };
}

const fsReadFilePromisified = promisify(fs.readFile);

fsReadFilePromisified("./data/foo.txt", "utf-8").then(console.log);

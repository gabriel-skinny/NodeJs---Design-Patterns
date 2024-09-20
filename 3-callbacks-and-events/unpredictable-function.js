import { readFile } from "fs";

const cache = new Map();

function inconsistentRead(filename, cb) {
  if (cache.has(filename)) {
    console.log("Sync Cache");
    cb(cache.get(filename));
  } else {
    readFile(filename, "utf-8", (err, data) => {
      console.log("Async");
      cache.set(filename, data);
      cb(data);
    });
  }
}

function createFileReader(filename) {
  const listeners = [];
  inconsistentRead(filename, (fileData) => {
    listeners.forEach((listener) => listener(fileData));
  });

  return {
    onDataReady: (listener) => listeners.push(listener),
  };
}

const reader1 = createFileReader("test.txt");
reader1.onDataReady((data) => {
  console.log(`First call data: ${data}`);

  const reader2 = createFileReader("test.txt");
  // Error: Not called becaus now inconsistenRead is Asnyc
  reader2.onDataReady((data) => {
    console.log(`Second call data: ${data}`);
  });
});

function fixedInconsistentRead(filename, cb) {
  if (cache.has(filename)) {
    console.log("Sync Cache");
    process.nextTick(() => cb(cache.get(filename)));
  } else {
    readFile(filename, "utf-8", (err, data) => {
      console.log("Async");
      cache.set(filename, data);
      cb(data);
    });
  }
}

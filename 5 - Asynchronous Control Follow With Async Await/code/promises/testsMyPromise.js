import MyPromise from "./myPromise";

console.log("\n ---- My Promise Execution -----");
const promise = new MyPromise((resolve, reject) => {
  console.log("Called My Promise");
  setTimeout(() => {
    resolve(10);
  }, 1000);
});

console.log("Before Then My Promise");
promise.then((data) => console.log(`Data my promisse: ${data}`));
console.log("After Then My Promise");

console.log("\n ---- Real Promise Execution -----");
const realPromise = new Promise((resolve, reject) => {
  console.log("Called real Promise");
  setTimeout(() => {
    resolve(10);
  }, 1000);
});

console.log("Before Then Real Promise");
realPromise.then((data) => console.log(`Data real promisse: ${data}`));
console.log("After Then Real Promise");

console.log("\n ---- My Promise Execution Sync -----");
const myPromiseSync = new MyPromise((resolve, reject) => {
  console.log("Called My myPromiseSync");
  resolve(10);
});

console.log("Before Then My myPromiseSync");
myPromiseSync.then((data) => console.log(`Data my myPromiseSync: ${data}`));
console.log("After Then My myPromiseSync");

console.log("\n ---- My Promise Reject -----");
const myPromiseReject = new MyPromise((resolve, reject) => {
  console.log("Called My myPromiseReject");
  reject(10);
});

console.log("Before Then My myPromiseReject");
myPromiseReject.catch((data) =>
  console.log(`Data my myPromiseReject: ${data}`)
);
console.log("After Then My myPromiseReject");

console.log("\n ---- Real Promise Chain -----");
const promiseChain = new Promise((resolve, reject) => {
  console.log("Called Real Promise Chain");
  resolve(10);
});

const promiseToChainAsync = function (data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Called Real Promise To Chain Async");
      resolve(data + 10);
    }, 300);
  });
};

console.log("Before Then Real Promise Chain");
promiseChain
  .then((data) => {
    console.log(`Data Real Promise Chain: ${data}`);
    return promiseToChainAsync(data);
  })
  .then((data) => {
    console.log(`Data second call Real Promise chain ${data}`);
  });
console.log("After Then Real Promise Chain");

console.log("\n ---- My Promise Chain -----");
const myPromiseChain = new MyPromise((resolve, reject) => {
  console.log("Called MyPromiseChain Promise Chain");
  resolve(10);
});

const myPromiseToChainAsync = function (data) {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      console.log("Called My Promise To Chain Async");
      resolve(data + 10);
    }, 300);
  });
};

console.log("Before Then My Promise Chain");
myPromiseChain
  .then((data) => {
    console.log(`Data My Promise Chain: ${data}`);
    return myPromiseToChainAsync(data);
  })
  .then((data) => {
    console.log(`Data second call My Promise chain ${data}`);
  });
console.log("After Then My Promise Chain");

class MyPromise {
  constructor(promisifiedFunc) {
    this.promisifiedFunc = promisifiedFunc;

    this.onResult = undefined;
    this.onError = undefined;
    this.onFullFilment = undefined;
    this.resolvedData = undefined;

    this.status = "pending";

    this.runPromise();

    return {
      then: this.then.bind(this),
      catch: this.catch.bind(this),
      finally: this.finally.bind(this),
    };
  }

  runPromise() {
    if (this.status != "pending") throw new Error("Canot run promisse twice");

    this.promisifiedFunc(
      (resolvedData) => {
        if (this.onResult) {
          this.status = "resolved";
          this.resolvedData = resolvedData;
          this.onResult(resolvedData);
        }
      },
      (rejectData) => {
        this.status = "rejected";
        if (this.onError) this.onError(rejectData);
      }
    );
  }

  then(onResult, onError) {
    if (this.status == "resolved") onResult(this.resolvedData);

    if (this.status == "pending") {
      this.onResult = onResult;
      this.onError = onError;
    }
  }

  catch(callback) {
    this.onError = callback;
  }

  finally(callback) {
    this.onFullFilment = callback;
  }
}

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

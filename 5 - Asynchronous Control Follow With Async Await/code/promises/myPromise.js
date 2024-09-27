export default class MyPromise {
  constructor(promisifiedFunc) {
    this.promisifiedFunc = promisifiedFunc;

    this.onResult = undefined;
    this.onError = undefined;
    this.onFullFilment = undefined;
    this.promiseResultData = undefined;
    this.returnOnResultData = undefined;
    this.promisseToResolve = undefined;
    this.lastPromiseReject = undefined;

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
        this.status = "resolved";
        this.promiseResultData = resolvedData;

        if (this.onResult) {
          this.returnOnResultData = this.onResult(resolvedData);

          this.promisseToResolve(this.returnOnResultData);
        }
      },
      (rejectData) => {
        this.status = "rejected";
        this.promiseResultData = rejectData;
        if (this.onError) this.onError(rejectData);
      }
    );
  }

  then(onResult, onError) {
    if (this.status == "resolved") {
      this.returnOnResultData = onResult(this.promiseResultData);

      if (this.returnOnResultData && this.returnOnResultData.then)
        return this.returnOnResultData;

      return new MyPromise((resolve, reject) => {
        resolve(this.returnOnResultData);
      });
    } else if (this.status == "rejected") onError(this.promiseResultData);
    else if (this.status == "pending") {
      this.onResult = onResult;
      this.onError = onError;
    }

    return new Promise((resolve, reject) => {
      this.promisseToResolve = resolve;
      this.lastPromiseReject = reject;
    });
  }

  catch(onError) {
    if (this.status == "rejected") onError(this.promiseResultData);

    this.onError = onError;
  }

  finally(callback) {
    this.onFullFilment = callback;
  }
}

const chainPromise = function () {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(10);
    }, 1000);
  });
};

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(10);
  }, 1000);
})
  .then((data) => {
    console.log(`First then data ${data}`);
    return chainPromise();
  })
  .then((data) => {
    console.log(`Second then data ${data}`);
  })
  .then((data) => {
    console.log(`Third then data ${data}`);
  })
  .then((data) => {
    console.log(`Fourth then data ${data}`);
  })
  .then((data) => {
    console.log(`Five then data ${data}`);
  });

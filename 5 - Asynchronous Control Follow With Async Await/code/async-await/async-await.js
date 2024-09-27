async function asyncFunction() {
  console.log("BEFORE AWAIT");
  const value = await delayPromise(500);
  console.log("AFTER AWAIT");
  console.log({ value });
}

function promiseFunction() {
  console.log("BEFORE Promise");
  delayPromise(500).then((value) => {
    console.log({ value });
  });
  console.log("AFTER Promise");
}

const delayPromise = function (time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const returnValue = 20;
      resolve(returnValue);
    }, time);
  });
};

asyncFunction();
promiseFunction();

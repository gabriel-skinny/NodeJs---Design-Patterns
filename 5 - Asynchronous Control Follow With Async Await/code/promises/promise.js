const myPromise = new Promise((resolve, reject) => {
  console.log("Criando Promise");
  resolve(10);
});
myPromise.console.log({ myPromise });

myPromise
  .then((value) => {
    console.log("Executado um then!");
    console.log({ value });

    return value;
  })
  .then((value) => {
    console.log("Executado um outro Then!");
    console.log({ value });

    return (value) => {
      return 20 + value;
    };
  })
  .then((value) => {
    console.log("EXECUTANDO um Terceiro Then!");
    console.log({ sumValue: value(10) });
  });

console.log({ myPromise: JSON.stringify(myPromise) });
console.log("Thens adicionados");

const promise2 = Promise.resolve(10);
promise2.then((value) => console.log(`Value resolved ${value}`));

function syncPromise() {
  return new Promise((resolve, reject) => {
    console.log("Sync promise body");
    resolve(10);
  });
}

syncPromise().then((data) => console.log(`Sync promise value: ${data}`));
console.log("Promisse sync");

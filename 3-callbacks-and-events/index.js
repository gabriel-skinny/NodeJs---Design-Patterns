console.log("Before");
//CPS = Continuation-Passin-Style
function addCps(a, b, callback) {
  callback(a + b);
}
addCps(3, 4, (result) => console.log(`Result: ${result}`));
console.log("After");

console.log("Before async");
function asyncAddCps(a, b, callback) {
  setTimeout(() => callback(a + b), 2000);
}
asyncAddCps(3, 4, (result) => console.log(`Result: ${result}`));
console.log("After async");

// Non-Cps callback

function nonCpsMyMap(callback) {
  const resultArray = [];
  this.forEach((i) => resultArray.push(callback(i)));

  return resultArray;
}

const array = [1, 3, 4, 5];
array.map = nonCpsMyMap;

console.log(`Result myMap: ${array.map((element) => element - 1)}`);

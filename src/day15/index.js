const { test, readInput } = require("../utils");

const prepareInput = (rawInput) => rawInput;

const input = prepareInput(readInput("input.txt")).split(',');
const testInput = prepareInput(readInput("test.txt")).split(require("os").EOL);

let initGame = function (gameMap, start) {
  start.map((element) => parseInt(element)).slice(0,-1).forEach((num, index) => {
    gameMap.set(num, index);
  });
}

const goAB = (input, finish) => {
  let gameMap = new Map();
  initGame(gameMap, input);
  let lastNum = parseInt(input[input.length-1]);
  for (let index = input.length-1; index < finish-1; index++){
    let nextNum = gameMap.has(lastNum) ? index - gameMap.get(lastNum) : 0;
    gameMap.set(lastNum, index);
    lastNum = nextNum;
  }
  return lastNum;
}

const goA = (input) => {
  return goAB(input, 2020)
}

const goB = (input) => {
  return goAB(input, 30000000)
}

/* Tests */

testInput.forEach((row) => {
  test(goA(row.split(';')[0].split(',')), parseInt(row.split(';')[1]));
});
testInput.forEach((row) => {
  test(goB(row.split(';')[0].split(',')), parseInt(row.split(';')[2]));
});

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

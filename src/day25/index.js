const { test, readInput } = require("../utils");
const EOL = require("os").EOL;

const prepareInput = (rawInput) => rawInput.split(EOL).map(Number);

const input = prepareInput(readInput("input.txt"));
const testInput = prepareInput(readInput("test.txt"));

const LARGE = 20201227;

const transformStep = (value, subject) => {
  return (value * subject) % LARGE;
}

const transform = (subject, loopSize) => {
  let value = 1;
  for (let loop = 1; loop <= loopSize; loop++){
    value = transformStep(value, subject);
  }
  return value;
}

const goA = (input) => {
  const SUBJECT = 7;
  let values = [1, 1];
  let loops = 0;

  while (values[0] != input[0] && values[1] != input[1]){
    values = values.map(value => transformStep(value, SUBJECT));
    loops++;
  }
  return transform(input[values[0] == input[0] ? 1 : 0], loops);
}

const goB = (input) => {
  return
}

/* Tests */

test(transform(7, 11), 17807724);
test(transform(7, 8), 5764801);
test(transform(17807724, 8), 14897079);
test(transform(5764801, 11), 14897079);
test(goA(testInput), 14897079);

/* Results */

console.time("Time");
const resultA = goA(input);
console.timeEnd("Time");

console.log("Solution to part 1:", resultA);

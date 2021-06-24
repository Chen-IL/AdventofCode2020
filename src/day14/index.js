const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))
const test2Input = prepareInput(readInput("test2.txt"))

let maskedValue = function (mask, value) {
  let result = (+value).toString(2).padStart(mask.length, '0').split('');
  for (let i = 0; i < mask.length; i++){
    let char = mask.charAt(i)
    if (char == 'X'){continue}
    else {
      result[i] = char
    }
  }
  return parseInt(result.join(''), 2)
}

let maskedMemoryCell = function (mask, value, xLocs) {
  let result = (+value).toString(2).padStart(mask.length, '0').split('');
  for (let i = 0; i < mask.length; i++){
    let char = mask.charAt(i)
    if (char == '0'){continue}
    else {
      result[i] = char
    }
    if (char == 'X'){xLocs.push(i)}
  }
  return result
}

const goA = (input) => {
  let mem = {};
  let mask = "";
  for (line of input){
    line = line.split(" = ")
    if (line[0] == "mask"){
      mask = line[1];
      continue;
    }
    let cell = line[0].slice(4,-1);
    mem[cell] = maskedValue(mask,line[1]);
  }
  return Object.values(mem).reduce((acc,val) => acc + val, 0);
}

const goB = (input) => {
  let mem = {};
  let mask = "";
  for (line of input){
    line = line.split(" = ")
    if (line[0] == "mask"){
      mask = line[1];
      continue;
    }
    let cell = line[0].slice(4,-1);
    let value = +line[1];
    let xLocs = [];
    let possibleMemoryCells = maskedMemoryCell(mask,cell, xLocs);

    for (let i = 0; i < Math.pow(2, xLocs.length); i++) {
      let toFillInX = i.toString(2).padStart(xLocs.length, '0').split('');
      xLocs.forEach((location, index) => {
        possibleMemoryCells[location] = toFillInX[index];
      });
      mem[parseInt(possibleMemoryCells.join(''), 2)] = value;
    }
  }
  return Object.values(mem).reduce((acc,val) => acc + val, 0);
}

/* Tests */

test(maskedValue(testInput[0].split(" = ")[1], testInput[1].split(" = ")[1]), 73)
test(maskedValue(testInput[0].split(" = ")[1], testInput[2].split(" = ")[1]), 101)
test(maskedValue(testInput[0].split(" = ")[1], testInput[3].split(" = ")[1]), 64)
test(goA(testInput), 165)
test(goB(test2Input), 208)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput

const input = prepareInput(readInput("input.txt")).split(require("os").EOL);
const testInput = prepareInput(readInput("test.txt")).split(require("os").EOL);

function evalInnerA(str){
  let splitStr = str.split(' ');
  if (splitStr.length <= 3){return eval(str)};
  
  splitStr.splice(0, 3, eval(splitStr.slice(0,3).join(' ')));
  return evalInnerA(splitStr.join(' '));
}

function evalInnerB(str){
  let splitStr = str.split(' ');
  if (splitStr.length <= 3){return eval(str)};

  let plusIndex = splitStr.indexOf("+");
  while (plusIndex != -1){
    splitStr.splice(plusIndex-1, 3, (parseInt(splitStr[plusIndex-1]) + parseInt(splitStr[plusIndex+1])).toString());
    plusIndex = splitStr.indexOf("+");
  }

  splitStr.splice(0, 3, eval(splitStr.slice(0,3).join(' ')));
  return evalInnerA(splitStr.join(' '));
}

function evalExpression(expr, evalInnerFunc){
  let matches = "";
  while (matches = expr.match(/\([^()]+\)/g)){
    for (let match of matches) {expr = expr.replace(match, evalInnerFunc(match.substr(1, match.length - 2)))}
  }
  return evalInnerFunc(expr);
}

const goA = (input) => {
  return input.reduce((result, line) => (evalExpression(line, evalInnerA) + result), 0);
}

const goB = (input) => {
  return input.reduce((result, line) => (evalExpression(line, evalInnerB) + result), 0);
}

/* Tests */

test(evalInnerA("4 * 5"), 20); //0
test(evalInnerA("1 + 2 * 3 + 4 * 5 + 6"), 71); //1
test(goA(["1 + 2 * 3 + 4 * 5 + 6"]), 71); //2
test(goA(["1 + (2 * 3) + (4 * (5 + 6))"]), 51); //3
test(goA(["2 * 3 + (4 * 5)"]), 26); //4
test(goA(["5 + (8 * 3 + 9 + 3 * 4 * 3)"]), 437); //5
test(goA(["5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))"]), 12240); //6
test(goA(["((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2"]), 13632); //7

test(evalInnerB("1 + 2 * 3 + 4 * 5 + 6"), 231); //8
test(goB(["1 + 2 * 3 + 4 * 5 + 6"]), 231); //9
test(goB(["1 + (2 * 3) + (4 * (5 + 6))"]), 51); //10
test(goB(["2 * 3 + (4 * 5)"]), 46); //11
test(goB(["5 + (8 * 3 + 9 + 3 * 4 * 3)"]), 1445); //12
test(goB(["5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))"]), 669060); //13
test(goB(["((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2"]), 23340); //14

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

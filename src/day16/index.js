const { test, readInput } = require("../utils")

const EOL = require("os").EOL;
let rules = [];
let myTicket = "";
let nearbyTickets = [];

const prepareInput = (rawInput) => {
  inputParts = rawInput.split(EOL + EOL).filter(line => line.length > 0);
  let cols = inputParts[0].split(EOL).length;
  rules = inputParts[0].split(EOL).map(row => ({
    field: row.split(':')[0],
    nums: row.split(':')[1].trim().split(" or ").map(rule => rule.split('-').map(Number)),
    cols: new Array(cols).fill(true),
    colsMatches: cols
  }));
  myTicket = inputParts[1].split(EOL)[1].split(',').map(Number);
  nearbyTickets = inputParts[2].split(EOL).slice(1).map(row => row.split(',').map(Number));
};

function matchingRule(num, rule){
  return ((num >= rule.nums[0][0] && num <= rule.nums[0][1]) ||
         (num >= rule.nums[1][0] && num <= rule.nums[1][1]));
}

function sumInvalidValues(rules, ticket){
  let result = 0;
  for (let num of ticket){
    let foundMatchingRule = false
    for (rule of rules){
      if (matchingRule(num, rule)){
        foundMatchingRule = true;
        break;
      }
    }
    if (!foundMatchingRule){result += num};
  }
  return result;
}

function isInvalidTicket(rules, ticket){
  for (let num of ticket){
    let foundMatchingRule = false;
    for (rule of rules){
      if (matchingRule(num, rule)){
        foundMatchingRule = true;
        break;
      }
    }
    if (!foundMatchingRule){return true}
  }
  return false
}

const goA = (input) => {
  return nearbyTickets.map(ticket => sumInvalidValues(rules, ticket)).reduce((sum, val) => (sum + val), 0);
}

const goB = (input, testing=false) => {
  nearbyTicketsB = nearbyTickets.filter(ticket => (!isInvalidTicket(rules,ticket)));
  
  nearbyTicketsB.forEach((row) => {
    row.forEach((col,index) => {
      rules.forEach((rule) => {
        if ((rule.cols[index]) && !matchingRule(col, rule)){rule.cols[index] = false;rule.colsMatches--;};
      });
    });
  });
  
  const ruleToCol = new Array(rules.length).fill("");
  let rulesMatched = 0;
  while (rulesMatched < rules.length){
    rules.forEach(rule => {
      if (rule.colsMatches == 1){
        let foundIndex = rule.cols.findIndex((cell) => cell == true)
        ruleToCol[foundIndex] = rule.field;
        rulesMatched++;
        rules.forEach(r => {
          if (r.cols[foundIndex]){
            r.cols[foundIndex] = false;
            r.colsMatches--;
          };
        });
      }
    });
  };
  if (testing){return ruleToCol};
  return ruleToCol.reduce((result,val,index) => {
    if (val.slice(0,9) == "departure"){return result * myTicket[index];}
    else {return result};
  }, 1);
}

/* Tests */

let testInput = prepareInput(readInput("test.txt"))
test(goA(testInput), 71)
testInput = prepareInput(readInput("test2.txt"))
test(goB(testInput,testing=true), ["row", "class", "seat"])

/* Results */

console.time("Time")
const input = prepareInput(readInput("input.txt"))
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

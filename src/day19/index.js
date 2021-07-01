const { test, readInput } = require("../utils")

const EOL = require("os").EOL;
let rules = new Map();

const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat().join(''))));

const prepareInput = (rawInput) => {
  let [rulesArray, messagesArray] = rawInput.split(EOL + EOL).map(v => v.split(EOL));
 /*  rules = rulesArray.reduce((map, row) => {
    map.set(row.split(": ")[0], row.split(": ")[1].replace(/[\"\"']+/g,'').split(' '));
    return map;
  }, new Map()); */

  rules = rulesArray.reduce((map, row) => {
    map.set(row.split(": ")[0], row.split(": ")[1].replace(/[\"\"']+/g,'').split(" | "));
    return map;
  }, new Map());
  return messagesArray;
}

// This function is unused. I wrote it to solve part 1, but later decided on a Regex approach for part 2 and adapted it for part 1 too.
function evalRule(ruleNum){
  let reqRule = rules.get(ruleNum);
  if (reqRule.every(isNaN) && reqRule.find(e => e == '|') == undefined){return reqRule};
  reqRule = reqRule.map(value => {
    if (isNaN(value)){
      return value;
    }
    else {
      return evalRule(value);
    };
  });
  let orIndex = reqRule.findIndex(e => e == '|');
  if (orIndex != -1){
    if (orIndex == 2){
      reqRule.splice(0, 2, cartesian(reqRule[0], reqRule[1]));
    }
    orIndex = reqRule.findIndex(e => e == '|');
    if (reqRule.length - orIndex == 3){
      reqRule.splice(orIndex+1, 2, cartesian(reqRule[orIndex+1], reqRule[orIndex+2]));
    }
    orIndex = reqRule.findIndex(e => e == '|');
  }
  if (orIndex == -1){
    reqRule = cartesian(...reqRule)
  }
  if (orIndex == 1 && reqRule.length == 3){
    reqRule.splice(1,1)
    reqRule = reqRule.flat()
  }
  rules.set(ruleNum, reqRule);
  return reqRule
}

const goA = (input) => {
  /* let ruleZero = evalRule("0");
  return input.map(row => (ruleZero.indexOf(row) != -1)?1:0).reduce((sum,val) => sum+val) */

  let regexZero = new RegExp("^" + evalRuleRegex("0",1) + "$");
  return input.filter(row => regexZero.test(row)).length;
}

function evalRuleRegex(ruleNum, part){
  let reqRule = rules.get(ruleNum);

  if ((Array.isArray(reqRule) && reqRule.every(value => value.split(' ').every(isNaN))) ||
     (!Array.isArray(reqRule) && reqRule.split(' ').every(isNaN))){return reqRule}

  reqRule = reqRule.map(value => value.split(' ').map(r => evalRuleRegex(r,part)).join('')).join('|')

  if (part == 2){
    if (ruleNum == 8){reqRule = "(" + evalRuleRegex("42",part) + ")+"}
    if (ruleNum == 11){
      let res = [];
      for (let i = 1; i < 15; i++){
        res.push(`((${evalRuleRegex("42",part)}){${i}}(${evalRuleRegex("31",part)}){${i}})`);
      }
      reqRule = "(" + res.join('|') + ")";
    }
  }

  reqRule = `(${reqRule})`;
  rules.set(ruleNum, reqRule);
  return reqRule;
}

const goB = (input) => {
  let regexZero = new RegExp("^" + evalRuleRegex("0",2) + "$");
  return input.filter(row => regexZero.test(row)).length;
}

/* Tests */

let testInput = prepareInput(readInput("test.txt"))
test(goA(testInput), 2)
testInput = prepareInput(readInput("test2.txt"))
test(goA(testInput), 3)
testInput = prepareInput(readInput("test2.txt"))
test(goB(testInput), 12)

/* Results */

console.time("Time")
let input = prepareInput(readInput("input.txt"))
const resultA = goA(input)
input = prepareInput(readInput("input.txt"))
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
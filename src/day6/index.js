const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL + require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))
const ordA = "a".charCodeAt(0)

// I'm using bitwise operations for practice
const countGroupOr = (group) => {
  let questions = 0
  for (let charLoc = 0; charLoc < group.length; charLoc++){
    let curOrd = group.charCodeAt(charLoc) - ordA
    if (curOrd < 0 || curOrd > 25){continue}

    questions |= 1 << curOrd
  }

  let count = 0
  while (questions){
    count += questions &1
    questions >>= 1
  }
  return count
}

const goA = (input) => {
  let allSum = 0
  for (let i = 0; i < input.length; i++){
    allSum += countGroupOr(input[i])
  }
  return allSum
}

const countGroupAnd = (group) => {
  let questions = new Array(26).fill(0)
  let groupPeople = group.split(require("os").EOL)
  for (let person = 0; person < groupPeople.length; person++){
    for (let charLoc = 0; charLoc < groupPeople[person].length; charLoc++){
      let curOrd = groupPeople[person].charCodeAt(charLoc) - ordA
      if (curOrd < 0 || curOrd > 25){continue}

      questions[curOrd]++
    }
  }

  let groupSum = 0
  for (let char = 0; char < questions.length; char++){
    if (questions[char] == groupPeople.length){groupSum++}
  }
  return groupSum
}

const goB = (input) => {
  let allSum = 0
  for (let i = 0; i < input.length; i++){
    allSum += countGroupAnd(input[i])
  }
  return allSum
}

/* Tests */

test(goA(testInput), 11)
test(goB(testInput), 6)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

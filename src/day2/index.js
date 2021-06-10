const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))

//this solution is almost ideal in terms of complexity - I have to go through every input line, and at worst case - though every character.
const goA = (input) => {
  let validPasswords = 0
  for (let i = 0; i < input.length; i++){
    let min = parseInt(input[i].split(' ')[0].split('-')[0])
    let max = parseInt(input[i].split(' ')[0].split('-')[1])
    let char = input[i].split(' ')[1].charAt(0)
    let password = input[i].split(' ')[2]
    let countWantedChar = 0
    for (let j = 0; j < password.length; j++){
      if (password.charAt(j) == char) {countWantedChar++}
    } // I can actually stop counting when countWantedChar > max
    if (countWantedChar >= min && countWantedChar <= max) {validPasswords++}
  }
  return validPasswords
}

const xor = (a,b) => {
  return ((a && !b) || (!a && b))
}

//this solution is ideal too - I must go through every input line, and compare 2 locations.
const goB = (input) => {
  let validPasswords = 0
  for (let i = 0; i < input.length; i++){
    let position1 = parseInt(input[i].split(' ')[0].split('-')[0])-1
    let position2 = parseInt(input[i].split(' ')[0].split('-')[1])-1
    let char = input[i].split(' ')[1].charAt(0)
    let password = input[i].split(' ')[2]
    if (xor(password.charAt(position1)==char,password.charAt(position2)==char)) {validPasswords++}
  }
  return validPasswords
}

/* Tests */

test(goA(testInput), 2)
test(goB(testInput), 1)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

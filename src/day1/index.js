const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testinput = prepareInput(readInput("test.txt"))

const goABrute = (input) => {
  let inputI = 0
  let inputJ = 0
  for (let i = 0; i < input.length; i++){
    for (let j = i+1; j < input.length; j++){
      inputI = parseInt(input[i])
      inputJ = parseInt(input[j])
      if (inputI+inputJ == 2020){
        return inputI*inputJ
      }
    }
  }
}

// We go over the input once, creating a dictionary along the way. For each number, we efficiently look in our past for its pair.
const goA = (input) => {
  let hash = {};
  for (let i = 0; i < input.length; i++){
    let iInt = parseInt(input[i]);
    if ((2020-iInt) in hash) {
      return (2020-iInt)*iInt;
    }
    else {
      hash[iInt] = 1;
    }
  }
}

const goBBrute = (input) => {
  for (let i = 0; i < input.length; i++){
    for (let j = i+1; j < input.length; j++){
      for(let k = j+1; k < input.length; k++){
        if (parseInt(input[i])+parseInt(input[j])+parseInt(input[k]) == 2020){
          console.log(input[i], "; ", input[j], "; ", input[k])
          return parseInt(input[i])*parseInt(input[j])*parseInt(input[k])
        }
      }
    }
  }
}

// We go over the input for the first time, for each element we go over all passed elements again
// and look for a third number (that will sum to 2020) efficiently within all passed elements.
const goB = (input) => {
  let hash = {}
  for (let i = 0; i < input.length; i++){
    let first = parseInt(input[i])
    for (const second of Object.keys(hash)){
      let third = 2020-first-second
      if (third == second){continue} //first is not yet in hash, but second and third are.
      if (third in hash) {
        return first*second*third
      }
    }
    hash[first] = 1
  }
}

/* Tests */

test(goA(testinput), 514579)
test(goB(testinput), 241861950)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

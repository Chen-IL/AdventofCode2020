const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL).map((element) => {return parseInt(element)})

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))
const testInput2 = prepareInput(readInput("test2.txt"))

const goA = (input) => {
  input.push(0)
  input.sort((a,b) => (a-b))
  input.push(input[input.length-1]+3)
  
  let diffs = new Array(4).fill(0)
  for (let i = 1; i < input.length; i++){diffs[input[i]-input[i-1]]++}
  return diffs[1]*diffs[3]
}

const goB = (input) => {
  input.sort((a,b) => (a-b))

  let possibilities = [1]
  input.forEach((value, index) => {
    let neighb = index + 1
    while (input[neighb] <= value + 3){
      possibilities[neighb] = (possibilities[neighb] || 0) + possibilities[index]
      neighb++
    }
  })
  return possibilities[input.length - 1]
}

/* Tests */

test(goA(testInput), 35)
test(goA(testInput2), 220)
test(goB(testInput), 8)
test(goB(testInput2), 19208)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

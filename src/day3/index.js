const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))

const goA = (input, right, down) => {
  const tree = '#'
  let treesCounter = 0
  const width = input[0].length
  
  for (let row = 0, col = 0; row < input.length; row+=down, col+=right){
    if (input[row].charAt(col%width) == tree){treesCounter++}
  }
  return treesCounter
}

const goB = (input) => {
  const slopes = [[1,1],[3,1],[5,1],[7,1],[1,2]]
  let result = 1
  for (let i = 0; i < slopes.length; i++){
    result *= goA(input,slopes[i][0],slopes[i][1])
  }
  return result
}

/* Tests */

test(goA(testInput,3,1), 7)
test(goB(testInput), 336)

/* Results */

console.time("Time")
const resultA = goA(input,3,1)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

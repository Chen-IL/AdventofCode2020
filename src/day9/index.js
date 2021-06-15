const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))

let checkValidity = function (arr, num){
  for (let i = 0; i < arr.length; i++){
    let curr = arr[i]
    if (curr > num || curr * 2 == num){continue}
    if (arr.includes(num-curr)){return true}
  }
  return false
}

const goA = (input, preamble) => {
  let arr = new Array(preamble)
  for (let i = 0; i < input.length; i++){
    let current = parseInt(input[i])
    if (i >= preamble){
      if (!checkValidity(arr,current)){return current}
    }
    arr[i % preamble] = current
  }
  return -1
}

let addMinMax = function (arr){
  return (Math.min(...arr) + Math.max(...arr))
}

const goB = (input, preamble) => {
  let goal = goA(input, preamble)
  let queue = []
  let sum = 0
  for (let i = 0; i < input.length; i++){
    let current = parseInt(input[i])
    queue.push(current)
    sum += current
    while (sum > goal){
      let oldest = queue.shift()
      sum -= oldest
    }
    if (sum == goal){return addMinMax(queue)}
  }
  return -1
}

/* Tests */

test(goA(testInput,5), 127)
test(goB(testInput,5), 62)

/* Results */

console.time("Time")
const resultA = goA(input,25)
const resultB = goB(input,25)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

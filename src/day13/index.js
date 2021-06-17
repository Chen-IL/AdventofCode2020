const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))

let nextDeparture = function (busNum, time){
  return busNum - (time % busNum)
}

const goA = (input) => {
  let time = parseInt(input[0])
  let busLines = input[1].split(',')
  let minimalWait = -1
  let chosenBus = -1
  for (let i = 0; i < busLines.length; i++){
    if (busLines[i] == "x"){continue}
    let busNum = parseInt(busLines[i])
    let currBusNext = nextDeparture(busNum, time)
    if (minimalWait == -1 || currBusNext < minimalWait){
      minimalWait = currBusNext
      chosenBus = busNum
    }
  }
  return minimalWait * chosenBus
}

/*
First we notice that our input is made of prime bus line numbers, which means they have no common divisors.
Now, we know the result will be some multiplication of the first bus number, so each iteration we need to increase by this number.
If we wish to generalize it - if I have a valid result (for a partial or full input) - bigger results will be found by adding to
the current result the multiplication of all the primes that participated.
*/

const goB = (input) => {
  let time = 0
  let busLines = input[1].split(',')
  let prevMulti = 1
  for (let i = 0; i < busLines.length; i++){
    if (busLines[i] == "x"){continue}
    let busNum = parseInt(busLines[i])
    while ((time + i) % busNum != 0) {time += prevMulti}
    prevMulti *= busNum
  }
  return time
}

/* Tests */

test(goA(testInput), 295)
test(goB(testInput), 1068781)
test(goB([0,"17,x,13,19"]), 3417)
test(goB([0,"67,7,59,61"]), 754018)
test(goB([0,"67,x,7,59,61"]), 779210)
test(goB([0,"67,7,x,59,61"]), 1261476)
test(goB([0,"1789,37,47,1889"]), 1202161486)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

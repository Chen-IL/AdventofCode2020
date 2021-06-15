const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL).map((row) => {return row.split('')})

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))

let isOccupied = function (seat) {return seat == '#'}
let isEmpty = function (seat) {return seat == 'L'}

let adjacentOccupiedSeats = function (seatMap, row, col) {
  let result = 0
  for (let adjRow = row - 1; adjRow <= row + 1; adjRow++){
    for (let adjCol = col - 1; adjCol <= col + 1; adjCol++){
      if (adjRow == row && adjCol == col){continue}
      if (adjRow >= 0 && adjRow < seatMap.length && 
        adjCol >= 0 && adjCol < seatMap[adjRow].length && isOccupied(seatMap[adjRow][adjCol])){
          result++
        }
    }
  }
  return result
}

const goA = (input) => {
  let isStabilized = false
  let occupiedSeats = 0
  while (!isStabilized){
    let updatedSeatMap = JSON.parse(JSON.stringify(input))
    occupiedSeats = 0
    isStabilized = true
    for (let row = 0; row < input.length; row++){
      for (let col = 0; col < input[row].length; col++){
        if (isOccupied(input[row][col])) {occupiedSeats++}
        let adjacentOccupied = adjacentOccupiedSeats(input, row, col)
        if (isEmpty(input[row][col]) && adjacentOccupied == 0){
          updatedSeatMap[row][col] = '#'
          isStabilized = false
        }
        else if (isOccupied(input[row][col]) && adjacentOccupied >= 4){
          updatedSeatMap[row][col] = 'L'
          isStabilized = false
        }
      }
    }
    input = JSON.parse(JSON.stringify(updatedSeatMap))
  }
  return occupiedSeats
}

const goABetter = (input) => {
  let occupiedSeats = 0
  while (true){
    let updatesPending = []
    occupiedSeats = 0
    for (let row = 0; row < input.length; row++){
      for (let col = 0; col < input[row].length; col++){
        if (isOccupied(input[row][col])) {occupiedSeats++}
        let adjacentOccupied = adjacentOccupiedSeats(input, row, col)
        if (isEmpty(input[row][col]) && adjacentOccupied == 0){
          updatesPending.push([row, col])
        }
        else if (isOccupied(input[row][col]) && adjacentOccupied >= 4){
          updatesPending.push([row, col])
        }
      }
    }
    if (updatesPending.length == 0) {return occupiedSeats}
    while (updatesPending.length > 0){
      let rowCol = updatesPending.pop()
      if (isOccupied(input[rowCol[0]][rowCol[1]])){input[rowCol[0]][rowCol[1]] = 'L'}
      else if (isEmpty(input[rowCol[0]][rowCol[1]])){input[rowCol[0]][rowCol[1]] = '#'}
    }
  }
  return -1
}

const goB = (input) => {
  return
}

/* Tests */

test(goABetter(testInput), 37)

/* Results */

console.time("Time")
const resultA = goABetter(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

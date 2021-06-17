const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL).map((row) => {return row.split('')})

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))

let isOccupied = function (seat) {return seat == '#'}
let isEmpty = function (seat) {return seat == 'L'}

let adjacentOccupiedSeatsA = function (seatMap, row, col) {
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

let adjacentOccupiedSeatsB = function (seatMap, row, col) {
  let result = 0
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
  for (let i = 0; i < dirs.length; i++){
    let adjRow = row
    let adjCol = col
    do {
      adjRow += dirs[i][0]
      adjCol += dirs[i][1]
      if (!(seatMap[adjRow] && seatMap[adjRow][adjCol])){break}
      if (isEmpty(seatMap[adjRow][adjCol])){break}
      if (isOccupied(seatMap[adjRow][adjCol])){
        result++
        break
      }
    } while (true)
  }
  return result
}

//this was my first attempt. It updates a copy of the seatMap,
//so every loop we copy the entire input twice, in addition to going over the entire input (which we must do regardless)
const goAWithArrayCopy = (input) => {
  let isStabilized = false
  let occupiedSeats = 0
  while (!isStabilized){
    let updatedSeatMap = JSON.parse(JSON.stringify(input))
    occupiedSeats = 0
    isStabilized = true
    for (let row = 0; row < input.length; row++){
      for (let col = 0; col < input[row].length; col++){
        if (isOccupied(input[row][col])) {occupiedSeats++}
        let adjacentOccupied = adjacentOccupiedSeatsA(input, row, col)
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

//my second attempt. The seatMap is actually updated at the end of each loop, if needed.
const goABetter = (input, adjacentOccupiedSeats, tolerance) => {
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
          occupiedSeats++ //unnecessary, only used for returning, but when on the final loop we don't reach this row
        }
        else if (isOccupied(input[row][col]) && adjacentOccupied >= tolerance){
          updatesPending.push([row, col])
          occupiedSeats-- //unnecessary too
        }
      }
    }
    if (updatesPending.length == 0) {return occupiedSeats}
    while (updatesPending.length > 0){
      let rowCol = updatesPending.pop()
      if (isOccupied(input[rowCol[0]][rowCol[1]])){input[rowCol[0]][rowCol[1]] = 'L'}
      else {input[rowCol[0]][rowCol[1]] = '#'}
    }
    // for (let i = 0; i < input.length; i++){console.log(input[i].join(''))}
    // console.log("")
  }
  return -1
}

const goA = (input) => {
  // return goAWithArrayCopy(input)
  let inputCopy = JSON.parse(JSON.stringify(input))
  return goABetter(inputCopy,adjacentOccupiedSeatsA, 4)
}

const goB = (input) => {
  let inputCopy = JSON.parse(JSON.stringify(input))
  return goABetter(inputCopy,adjacentOccupiedSeatsB, 5)
}

/* Tests */

test(goA(testInput), 37)
test(goB(testInput), 26)

let testArray = [".......#.".split(''), "...#.....".split(''), ".#.......".split(''), ".........".split(''), "..#L....#".split(''), "....#....".split(''), ".........".split(''), "#........".split(''), "...#.....".split('')]
test(adjacentOccupiedSeatsB(testArray,4,3),8)
testArray = [".............".split(''), ".L.L.#.#.#.#.".split(''), ".............".split('')]
test(adjacentOccupiedSeatsB(testArray,1,1),0)
testArray = [".##.##.".split(''), "#.#.#.#".split(''), "##...##".split(''), "...L...".split(''), "##...##".split(''), "#.#.#.#".split(''), ".##.##.".split('')]
test(adjacentOccupiedSeatsB(testArray,3,3),0)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

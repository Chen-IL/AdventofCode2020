const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))

const passToId =  (pass) => {
  let row = ""
    let col = ""
    for (let digit = 0; digit < pass.length; digit++){
      switch(pass.charAt(digit)){
        case 'F':
          row += "0"
          break
        case 'B':
          row += "1"
          break
        case 'L':
          col += "0"
          break
        case 'R':
          col += "1"
          break
      }
    }
    let id = parseInt(row,2) * 8 + parseInt(col,2)
    // console.log(`${pass}: row ${parseInt(row,2)}, column ${parseInt(col,2)}, seat ID ${id}`)
  return id
}

const goA = (input) => {
  let maxId = 0
  for (let i = 0; i < input.length; i++){
    let id = passToId(input[i])
    if (id > maxId) {maxId = id}
  }
  return maxId
}

const goB = (input) => {
  let allIds = new Array(950).fill(0)
  for (let i = 0; i < input.length; i++){
    allIds[passToId(input[i])] = 1
  }
  for (let i = 0; i < allIds.length; i++){
    if (allIds[i] == 1 && allIds[i+1] == 0 && allIds[i+2] == 1){return i+1}
  }
  return -1
}

/* Tests */

test(goA(testInput), 820)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

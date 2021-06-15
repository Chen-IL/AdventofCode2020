const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))

const goA = (input) => {
  let i = 0
  let acc = 0
  let visited = new Array(input.length).fill(false)
  while (i < input.length){
    let row = input[i].split(' ')
    if (visited[i] == true){break}
    visited[i] = true
    switch (row[0]){
      case "nop":
        i++
        break
      case "acc":
        acc = eval(acc + row[1])
        i++
        break
      case "jmp":
        i = eval(i + row[1])
        break
    }
  }
  return acc
}

const goB = (input) => {
  let i = 0
  let acc = 0
  let visited = new Array(input.length).fill(false)
  
  let lookingForChange = true
  let snapshotVisited = []
  let snapshotAcc = 0
  let snapshotI = 0
  
  while (i < input.length){
    let row = input[i].split(' ')
    if (lookingForChange && row[0] != "acc"){
      lookingForChange = false
      snapshotVisited = [...visited]
      snapshotAcc = acc
      snapshotI = i

      if (row[0] == "jmp"){row[0] = "nop"}
      else {row[0] = "jmp"}
    }
    if (visited[i] == true){
      visited = [...snapshotVisited]
      acc = snapshotAcc
      i = snapshotI
      lookingForChange = true
      row = input[i].split(' ')
    }
    visited[i] = true
    switch (row[0]){
      case "nop":
        i++
        break
      case "acc":
        acc = eval(acc + row[1])
        i++
        break
      case "jmp":
        i = eval(i + row[1])
        break
    }
  }
  if (i == input.length){return acc}
  else {return -1}
}

/* Tests */

test(goA(testInput), 5)
test(goB(testInput), 8)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

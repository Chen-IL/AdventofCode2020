const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))
const testInput2 = prepareInput(readInput("test2.txt"))

let inputToDict = function (input) {
  let result = {}
  for (let i = 0; i < input.length; i++){
    let outerBag = input[i].split(" bags contain ")[0]
    let innerBags = input[i].split(" bags contain ")[1].split(", ")
    if (innerBags[0] == "no other bags."){continue}
    for (let j = 0; j < innerBags.length; j++){
      let innerBag = innerBags[j].split(' ')[1] + " " + innerBags[j].split(' ')[2]
      if (innerBag in result){
        result[innerBag].push(outerBag)
      }
      else {
        result[innerBag] = [outerBag]
      }
    }
  }
  return result
}

const goA = (input) => {
  let containedIn = inputToDict(input)
  let possibleBags = 0
  let queue = [["shiny gold"]]
  let checkedColors = {}
  while (queue.length > 0){
    next = queue.pop() //my "queue" is acting like a stack, but I don't care about order
    for (let i = 0; i < next.length; i++){
      if (next[i] in checkedColors){continue}
      checkedColors[next[i]] = 1
      if (next[i] in containedIn){queue.push(containedIn[next[i]])}
      possibleBags++
    }
  }
  return possibleBags-1 //because I don't want the shiny bag as outside bag
}

let inputToDictB = function (input) {
  let result = {}
  for (let i = 0; i < input.length; i++){
    let outerBag = input[i].split(" bags contain ")[0]
    let innerBags = input[i].split(" bags contain ")[1].split(", ")
    if (innerBags[0] == "no other bags."){
      result[outerBag] = "0"
      continue
    }
    for (let j = 0; j < innerBags.length; j++){
      let innerBag = innerBags[j].split(' ')[0] + "." + innerBags[j].split(' ')[1] + " " + innerBags[j].split(' ')[2]
      if (outerBag in result){
        result[outerBag].push(innerBag)
      }
      else {
        result[outerBag] = [innerBag]
      }
    }
  }
  return result
}

let bagsInBag = function (map, color) {
  if (map[color] == "0"){return 1}
  let innerColors = map[color]
  let result = 1
  for (let i = 0; i < innerColors.length; i++){
    let recur = bagsInBag(map, innerColors[i].split('.')[1])
    result += parseInt(innerColors[i][0]) * recur
  }
  return result
}

const goB = (input) => {
  let contains = inputToDictB(input)
  return bagsInBag(contains, "shiny gold") - 1
}

/* Tests */

test(goA(testInput), 4)
test(goB(testInput), 32)
test(goB(testInput2), 126)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

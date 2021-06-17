const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))

const headingMap = {'N':0, 'E':90, 'S':180, 'W':270}

let manhattanDist = function (location) {
  return Math.abs(location[0]) + Math.abs(location[1])
}

let moveInDirection = function (location, direction, amount){
  switch (direction) {
    case 90:
      location[0] += amount
      break
    case 180:
      location[1] -= amount
      break
    case 270:
      location[0] -= amount
      break
    case 0:
      location[1] += amount
      break
  }
  return location
}

const goA = (input) => {
  let location = [0, 0]
  let heading = 90
  for (let i = 0; i < input.length; i++){
    let instruction = input[i]
    let action = instruction.charAt(0)
    let amount = parseInt(instruction.slice(1))
    switch (action){
      case 'F':
        location = moveInDirection(location, heading, amount)
        break
      case 'L':
        heading = (heading - amount) % 360
        while (heading < 0){heading += 360}
        break
      case 'R':
        heading = (heading + amount) % 360
        break
      default: //'N', 'E', 'S', 'W'
        location = moveInDirection(location, headingMap[action], amount)
        break
    }
  }
  return manhattanDist(location)
}

let rotateWaypoint = function(waypoint, instruction){
  if (instruction.slice(1) == "180"){
    waypoint[0] = -waypoint[0]
    waypoint[1] = -waypoint[1]
    return waypoint
  }
  if (instruction == "R90" || instruction == "L270"){
    let temp = waypoint[0]
    waypoint[0] = waypoint[1]
    waypoint[1] = -temp
    return waypoint
  }
  if (instruction == "R270" || instruction == "L90"){
    let temp = waypoint[0]
    waypoint[0] = -waypoint[1]
    waypoint[1] = temp
    return waypoint
  }
}

const goB = (input) => {
  let location = [0, 0]
  let waypoint = [10, 1]
  for (let i = 0; i < input.length; i++){
    let instruction = input[i]
    let action = instruction.charAt(0)
    let amount = parseInt(instruction.slice(1))
    switch(action){
      case 'N':
        waypoint[1] += amount
        break
      case 'E':
        waypoint[0] += amount
        break
      case 'S':
        waypoint[1] -= amount
        break
      case 'W':
        waypoint[0] -= amount
        break
      case 'F':
        location[0] += waypoint[0] * amount
        location[1] += waypoint[1] * amount
        break
      default: //'L', 'R'
        waypoint = rotateWaypoint(waypoint, instruction)
        break
    }
  }
  return manhattanDist(location)
}

/* Tests */

test(goA(testInput), 25)
test(goB(testInput), 286)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

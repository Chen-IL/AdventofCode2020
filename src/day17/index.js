const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))

const pocket = new Map();
let dimensions = [[0,0],[0,0],[0,0],[0,0]];
const CYCLES = 6;

function initInput(input) {
  pocket.clear();
  let rows = input.split(require("os").EOL);
  dimensions = [[0,rows[0].length], [0,rows.length], [0,1], [0,1]];
  rows.forEach((row, rowIndex) => {
    row.split('').forEach((cell, colIndex) => {
      if (cell == '#') {pocket.set(`${colIndex};${rowIndex};0;0`, '#');}
    });
  });
  return;
}

function countActiveNeighbors (key){
  let xyzw = key.split(';').map(Number);
  let result = 0;
  for (let x = xyzw[0]-1; x <= xyzw[0]+1; x++){
    for (let y = xyzw[1]-1; y <= xyzw[1]+1; y++){
      for (let z = xyzw[2]-1; z <= xyzw[2]+1; z++){
        for (let w = xyzw[3]-1; w <= xyzw[3]+1; w++){
          if (x == xyzw[0] && y == xyzw[1] && z == xyzw[2] && w == xyzw[3]){continue;}
          if (pocket.has(`${x};${y};${z};${w}`)){result++;}
        }
      }
    }
  }
  return result;
}

const goA = (input) => {
  return goB(input, 3)
}

const goB = (input, numDimensions = 4) => {
  initInput(input);
  for (let cycle = 0; cycle < CYCLES; cycle++){
    let activate = [];
    let inactivate = [];
    
    /* dimensions.map(minMax => {
      minMax[0]--;
      minMax[1]++;
      return minMax;
    });
    if (numDimensions == 3){dimensions[3] = [0,1];} */
    
    // instead of expanding every dimension every cycle, I'm getting the active "area" only, and increase it
    dimensions = dimensions.map(() => {
      return [Infinity, -Infinity];
    });
    pocket.forEach((value, key) => {
      let splitKey = key.split(';').map(Number);
      for (let dim = 0; dim < dimensions.length; dim++){
        if (splitKey[dim] - 1 < dimensions[dim][0]){dimensions[dim][0] = splitKey[dim] - 1;}
        if (splitKey[dim] + 2 > dimensions[dim][1]){dimensions[dim][1] = splitKey[dim] + 2;}
      }
    });

    if (numDimensions == 3){dimensions[3] = [0,1];};
    for (let x = dimensions[0][0]; x < dimensions[0][1]; x++){
      for (let y = dimensions[1][0]; y < dimensions[1][1]; y++){
        for (let z = dimensions[2][0]; z < dimensions[2][1]; z++){
          for (let w = dimensions[3][0]; w < dimensions[3][1]; w++){
            let key = `${x};${y};${z};${w}`;
            let activeNeighbors = countActiveNeighbors(key);
            if (pocket.has(key)){
              if (activeNeighbors != 2 && activeNeighbors != 3){inactivate.push(key);}
            }
            else {
              if (activeNeighbors == 3){activate.push(key);}
            }
          }
        }
      }
    }
    activate.forEach(key => {
      pocket.set(key, '#');
    });
    inactivate.forEach(key => {
      pocket.delete(key);
    });
  }
  return pocket.size;
}

/* Tests */

test(goA(testInput), 112)
test(goB(testInput), 848)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

const { test, readInput } = require("../utils");
const EOL = require("os").EOL;

const prepareInput = (rawInput) => rawInput.split(EOL);

const input = prepareInput(readInput("input.txt"));
const testInput = prepareInput(readInput("test.txt"));

const initFloor = (instructions) => {
  let floor = new Map();
  const ORIGIN = [0,0];

  instructions.forEach(item => {
    let location = [...ORIGIN];
    for (let index = 0; index < item.length; index++){
      let currChar = item.charAt(index);
      if (['n', 's'].includes(currChar)){
        location[1] += currChar == 'n' ? 1 : -1;
        location[0] += item.charAt(++index) == 'e' ? 1 : -1;
      }
      else {
        location[0] += item.charAt(index) == 'e' ? 2 : -2;
      }
    }
    let locationStr = location.join(';');
    let currentColor = floor.get(locationStr) || 'w';
    floor.set(locationStr, currentColor == 'w' ? 'b' : 'w');
  });

  return floor;
}

const goA = (input) => {
  let floor = initFloor(input);
  return [...floor.values()].reduce((res, color) => res += color == 'b' ? 1 : 0, 0);
}

const goB = (input) => {
  let floor = initFloor(input);
  let blackCount = [...floor.values()].reduce((res, color) => res += color == 'b' ? 1 : 0, 0);

  const DAYS = 100;
  const DIRS = [[2,0], [1,-1], [-1,-1], [-2,0], [-1,1], [1,1]];
  for (let day = 1; day <= DAYS; day++){
    let status = new Map();
    let blacks = [...floor.keys()].filter(key => floor.get(key) == 'b');
    let whites = [];

    while (blacks.length > 0){
      let current = blacks.pop().split(';').map(Number);
      let blackNeighbors = 0;
      DIRS.forEach(dir => {
        let neighbor = [current[0]+dir[0], current[1]+dir[1]];
        let neighborStr = neighbor.join(';')
        if ((floor.get(neighborStr) || 'w') == 'b') {
          blackNeighbors++;
        }
        else if (!status.has(neighborStr)) {
          whites.push(neighbor.join(';'));
          status.set(neighborStr, "Queued");
        }
      });
      if (blackNeighbors == 0 || blackNeighbors > 2){
        status.set(current.join(';'), "w");
        blackCount--;
      }
    }
    while (whites.length > 0){
      let current = whites.pop().split(';').map(Number);
      let blackNeighbors = 0;
      DIRS.forEach(dir => {
        let neighbor = [current[0]+dir[0], current[1]+dir[1]];
        let neighborStr = neighbor.join(';')
        if ((floor.get(neighborStr) || 'w') == 'b') {
          blackNeighbors++;
        }
      });
      if (blackNeighbors ==  2){
        status.set(current.join(';'), "b");
        blackCount++;
      }
      else {
        status.delete(current.join(';'));
      }
    }
    status.forEach((color, location) => {
      floor.set(location, color);
    });
  }
  return blackCount;
}

/* Tests */

test(goA(testInput), 10);
test(goB(testInput), 2208);

/* Results */

console.time("Time");
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd("Time");

console.log("Solution to part 1:", resultA);
console.log("Solution to part 2:", resultB);

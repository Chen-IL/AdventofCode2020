const { test } = require("../utils");

const INPUT = "598162734";
const TESTINPUT = "389125467";

const circleToString = (circle) => {
  let oneIndex = circle.findIndex(el => el == 1);
  let res = circle.slice(oneIndex+1);
  if (oneIndex > 0){
    res = res.concat(circle.slice(0,oneIndex));
  }
  return res.join('');
}

const game = (circle, moves) => {
  const maxNum = circle.length;
  let currI = 0;
  for (let move = 0; move < moves; move++){
    let pickUp = circle.splice(currI+1, 3);
    let cupsRemovedFromFront = 3 - pickUp.length;
    pickUp = pickUp.concat(circle.splice(0, cupsRemovedFromFront));
    currI -= cupsRemovedFromFront;

    let destNum = (circle[currI] - 1) || maxNum;
    while (pickUp.includes(destNum)){
      destNum = (destNum -1) || maxNum;
    }
    let destI = circle.findIndex(el => el == destNum);
    circle.splice(destI+1, 0, ...pickUp);

    if (destI < currI){currI += 3};

    currI = (currI + 1) % maxNum;
  }
  return circle;
}

const goA = (input, moves) => {
  let circle = input.split('').map(Number);
  circle = game(circle, moves);

  return circleToString(circle);
}

//map as a linked list. lazy initialized.
let cyclicMap = new Map();
const next = (num) => {
  if (cyclicMap.has(num)) {return cyclicMap.get(num);}
  else {
    cyclicMap.set(num, num+1);
    return num+1;
  }
}

const goB = (input) => {
  let circle = input.split('').map(Number);
  let maxNum = circle.length;
  const MAXFULL = 10**6;
  const MOVES = 10**7;

  /*
  let addition = [...Array(10**6+1).keys()];
  circle = [...circle, ...addition.slice(maxNum+1)];
 */

  cyclicMap = circle.slice(0, -1).reduce((map, num, index) => {
    map.set(num, circle[index+1])
    return map;
  }, new Map());
  cyclicMap.set(circle[maxNum-1], maxNum+1);
  cyclicMap.set(MAXFULL, circle[0]);

  let currNum = circle[0];
  for (let move = 0; move < MOVES; move++){
    let pickUp = [];
    pickUp.push(next(currNum));
    pickUp.push(next(pickUp[0]));
    pickUp.push(next(pickUp[1]));

    let destNum = (currNum - 1) || MAXFULL;
    while (pickUp.includes(destNum)){
      destNum = (destNum -1) || MAXFULL;
    }

    cyclicMap.set(currNum, next(pickUp[2]));
    cyclicMap.set(pickUp[2], next(destNum));
    cyclicMap.set(destNum, pickUp[0]);

    currNum = next(currNum);
  }

  return next(1) * next(next(1));
}

/* Tests */

test(goA(TESTINPUT, 10), "92658374");
test(goA(TESTINPUT, 100), "67384529");
test(goB(TESTINPUT), 149245887792);

/* Results */

console.time("Time");
const resultA = goA(INPUT, 100);
const resultB = goB(INPUT);
console.timeEnd("Time");

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

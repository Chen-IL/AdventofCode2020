const { test, readInput } = require("../utils")
const EOL = require("os").EOL

const prepareInput = (rawInput) => rawInput.split(EOL+EOL).map(player => player.split(EOL).slice(1).map(Number));

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))

const calculateScore = (cards) => cards.flat().reduce((res, value, index) => res + value * (cards.flat().length - index), 0);

const goA = (input) => {
  let cards = [[...input[0]], [...input[1]]];
  while (cards[0].length > 0 && cards[1].length > 0){
    let card0 = cards[0].shift();
    let card1 = cards[1].shift();
    if (card0 > card1){
      cards[0].push(card0, card1);
    }
    else {
      cards[1].push(card1, card0);
    }
  }
  return calculateScore(cards);
}

const decksToString = (cards) => cards.map(arr => arr.join(',')).join(';');

const recursiveGame = (cards) => {
  let gameHistory = new Map();
  while (cards[0].length > 0 && cards[1].length > 0){
    if (gameHistory.has(decksToString(cards))) {return 0;}
    gameHistory.set(decksToString(cards), true);

    let play = [cards[0].shift(), cards[1].shift()];
    let winner;
    if (cards[0].length >= play[0] && cards[1].length >= play[1]){
      winner = recursiveGame([cards[0].slice(0,play[0]), cards[1].slice(0,play[1])]);
    }
    else {
      winner = (play[0] > play[1]) ? 0 : 1;
    }

    cards[winner].push(play[winner], play[1-winner]);
  }
  return (cards[0].length == 0) ? 1 : 0;
}


const goB = (input) => {
  let cards = [[...input[0]], [...input[1]]];

  let winner = recursiveGame(cards);

  return calculateScore(cards[winner]);
}

/* Tests */

test(goA(testInput), 306);
test(goB(testInput), 291);

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)

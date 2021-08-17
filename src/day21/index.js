const { test, readInput } = require("../utils");
const EOL = require("os").EOL;

// Returning a new array of rows, 
// each row: [array of ingredients, array of allergens]
const prepareInput = (rawInput) => {
  return rawInput.split(EOL).map(row => row.split (" (contains "))
  .map(spRow => [spRow[0].split(' '), spRow[1].slice(0,-1).split(", ")]);
};

const input = prepareInput(readInput("input.txt"));
const testInput = prepareInput(readInput("test.txt"));

const insertAllergen = (map, allergen, ingredients) => {
  let updatedIngredients;
  if (map.has(allergen)){
    updatedIngredients = map.get(allergen).filter(ingredient => ingredients.includes(ingredient));
  }
  else {
    updatedIngredients = ingredients;
  }
  map.set(allergen, updatedIngredients);
}

const goAandB = (input) => {
  let allergens = new Map();
  input.forEach(row => row[1].forEach(allergen => insertAllergen(allergens, allergen, row[0])));

  let updatedIngredients = new Map();
  let loopIsStatic = false;
  while (!loopIsStatic){
    loopIsStatic = true;
    allergens.forEach((ingredients, allergen) => {
      if (ingredients.length > 1 || updatedIngredients.has(ingredients[0])) {return;}
      updatedIngredients.set(ingredients[0], true);
      loopIsStatic = false;
    });
    allergens.forEach((ingredients, allergen) => {
      if (ingredients.length == 1) {return;}

      ingredients = ingredients.filter(ingredient => !updatedIngredients.has(ingredient));
      allergens.set(allergen, ingredients);
    })
  }

  return allergens;
}

const goA = (input) => {
  let allergens = goAandB(input);

  let allergenicIngredients = new Map();
  allergens.forEach((ingredients, allergen) => ingredients.forEach(ingredient => allergenicIngredients.set (ingredient, true)));
  return input.reduce((res, row) => res + row[0].filter(ingredient => !allergenicIngredients.has(ingredient)).length, 0);
}

const goB = (input) => {
  let allergens = goAandB(input);
  return [...allergens.keys()].sort().map(allergen => allergens.get(allergen)[0]).join();
}

/* Tests */

test(goA(testInput), 5);

/* Results */

console.time("Time");
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd("Time");

console.log("Solution to part 1:", resultA);
console.log("Solution to part 2:", resultB);

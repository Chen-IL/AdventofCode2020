const { test, readInput } = require("../utils");
const EOL = require("os").EOL;

function reverse(str) {
  return str.split("").reverse().join("");
}

// map might have values when I run this. make sure to clear it.
// UPDATE: I always start a new map and return it.
const prepareInputA = (rawInput) => {
  return rawInput.split(EOL + EOL).reduce((map, tile) => {
    tile = tile.split(EOL);
    tileNum = parseInt(tile[0].slice(5,-1));
    tile = tile.slice(1);

    let tileEdges = new Array(4);
    tileEdges.push(tile[0]);
    tileEdges.push(tile[tile.length-1]);
    tileEdges.push(tile.reduce((edgeCol, fullRow) => edgeCol += fullRow.slice(0,1), ""));
    tileEdges.push(tile.reduce((edgeCol, fullRow) => edgeCol += fullRow.slice(-1), ""));

    tileEdges.forEach(edge => {
      let reversedEdge = reverse(edge);
      if (!map.has(edge) && !map.has(reversedEdge)){
        map.set(edge, []);
      }
      if (map.has(edge)){
        map.get(edge).push(tileNum);
      }
      else if (map.has(reversedEdge)){
        map.get(reversedEdge).push(tileNum);
      }
    });

    return map;
  }, new Map());
}

const goA = (input) => {
  let countRepeats = new Map();
  let result = 1;
  input.forEach(value => {
    if (value.length == 1){
      let tileNum = value[0];
      if (countRepeats.has(tileNum)){
        let count = countRepeats.get(tileNum)
        countRepeats.set(tileNum,count+1);
        result *= tileNum;
      }
      else {
        countRepeats.set(tileNum,1);
      }
    }
  });
  return result;
}

/*
  ###################################
  ###################################
  ###################################

                PART B

  ###################################
  ###################################
  ###################################
*/

const DIRECTIONS = ["top", "right", "bottom", "left"];
const opposite = (direction) => {
  switch(direction){
    case "top":
      return "bottom";
    case "bottom":
      return "top";
    case "left":
      return "right";
    case "right":
      return "left";
  }
}
const MONSTER = [
  "                  # ",
  "#    ##    ##    ###",
  " #  #  #  #  #  #   "
];

let edgeToContainingTilesMap = new Map();

const getTilesByStrEdge = (edge) => {
  let map = edgeToContainingTilesMap;
  if (map.has(edge)){
    return map.get(edge);
  }
  let reversedEdge = reverse(edge);
  if (map.has(reversedEdge)){
    return map.get(reversedEdge);
  }
  throw new Error("requested edge not in map");
}

const setTileHasEdge = (tileID, edge) => {
  let map = edgeToContainingTilesMap;
  let reversedEdge = reverse(edge);
  let wantedEdge = map.has(reversedEdge) ? reversedEdge : edge;
  if (!map.has(wantedEdge)){
    map.set(wantedEdge, []);
  }
  map.get(wantedEdge).push(tileID);
}

const prepareInputB = (rawInput) => {
  edgeToContainingTilesMap.clear();

  return rawInput.split(EOL + EOL).reduce((map, tile) => {
    tile = tile.split(EOL);
    tileNum = parseInt(tile[0].slice(5,-1));
    tile = tile.slice(1);

    let obj = {
      tileNum: tileNum,
      fullTile: tile,
      top: tile[0],
      bottom: tile[tile.length-1],
      left: tile.reduce((edgeCol, fullRow) => edgeCol += fullRow.slice(0,1), ""),
      right: tile.reduce((edgeCol, fullRow) => edgeCol += fullRow.slice(-1), ""),
      x: 0, y: 0
    };

    setTileHasEdge(tileNum, obj.top);
    setTileHasEdge(tileNum, obj.bottom);
    setTileHasEdge(tileNum, obj.left);
    setTileHasEdge(tileNum, obj.right);

    map.set(tileNum, obj);
    return map;
  }, new Map());
}

const flipTile = (map, tileNum, edgeDir) => {
  let tile = map.get(tileNum);

  if ((edgeDir == "top") || (edgeDir == "bottom")){
    let currentRight = tile.right;
    tile.right = tile.left;
    tile.left = currentRight;
    tile.top = reverse(tile.top);
    tile.bottom = reverse(tile.bottom);
    tile.fullTile = tile.fullTile.map(reverse);
  }
  else if ((edgeDir == "right") || (edgeDir == "left")){
    let currentTop = tile.top;
    tile.top = tile.bottom;
    tile.bottom = currentTop;
    tile.right = reverse(tile.right);
    tile.left = reverse(tile.left);
    tile.fullTile = tile.fullTile.reverse();
  }
  // all changes are applied by reference.
}

const singleRotationOfArray = (arr) => {
  let rotated = [];
  for (let row = 0; row < arr.length; row++){
    let rowStr = "";
    for (let oldRow = arr.length-1; oldRow >= 0; oldRow--){
      rowStr += arr[oldRow].charAt(row);
    }
    rotated.push(rowStr);
  }
  return rotated;
}

// In addition to rotating, returns the requested edge after rotation.
const rotateTile = (map, tileNum, currentDir, wantedDir) => {
  let tile = map.get(tileNum);
  let rotations = (DIRECTIONS.length + DIRECTIONS.indexOf(wantedDir) - DIRECTIONS.indexOf(currentDir)) % DIRECTIONS.length;

  if (rotations >=2){
    let currentTop = tile.top;
    let currentRight = tile.right;
    tile.right = reverse(tile.left);
    tile.left = reverse(currentRight);
    tile.top = reverse(tile.bottom);
    tile.bottom = reverse(currentTop);
    tile.fullTile = tile.fullTile.map(reverse).reverse();
  }

  if (rotations % 2 == 1){
    let currentTop = tile.top;
    tile.top = reverse(tile.left);
    tile.left = tile.bottom;
    tile.bottom = reverse(tile.right);
    tile.right = currentTop;
    tile.fullTile = singleRotationOfArray(tile.fullTile);
  }

  return tile[wantedDir];
}

// let obj = {
//   tileNum: "1",
//   fullTile: ["abcd", "efgh", "ijkl", "mnop"],
//   top: "abcd",
//   bottom: "mnop",
//   left: "aeim",
//   right: "dhlp",
//   x: 0, y: 0
// };

// let testMap = new Map();
// testMap.set("1", obj);
// console.log(testMap.get("1"));
// rotateTile(testMap, "1", "bottom", "right");
// console.log(testMap.get("1"))

const getNeighborTile = (map, alreadyFoundLocation, edge) => {
  let res = {found: false};

  getTilesByStrEdge(edge).filter(tileNum => !alreadyFoundLocation.has(tileNum))
  .find(tileNum => {
    let tile = map.get(tileNum);
    let relativeDir = DIRECTIONS.find(dir => (edge == tile[dir]) || (reverse(edge) == tile[dir]));
    if (!relativeDir) {return false;}
    res = {
      found: true,
      tileNum: tileNum,
      dir: relativeDir
    };
    return true;
  });

  return res;
}

const setCoordinates = (map, alreadyFoundLocation, direction, referenceTileNum, tileNum) => {
  let referenceTile = map.get(referenceTileNum);
  let tile = map.get(tileNum);

  switch(direction) {
    case "top":
      tile.x = referenceTile.x;
      tile.y = referenceTile.y + 1;
      break;
    case "right":
      tile.x = referenceTile.x + 1;
      tile.y = referenceTile.y;
      break;
    case "bottom":
      tile.x = referenceTile.x;
      tile.y = referenceTile.y - 1;
      break;
    case "left":
      tile.x = referenceTile.x - 1;
      tile.y = referenceTile.y;
      break;
  }

  alreadyFoundLocation.set(tileNum, true);
}

const setAllTilesLocations = (map) => {
  let alreadyFoundLocation = new Map();
  let queue = [];
  queue.push(map.keys().next().value);
  alreadyFoundLocation.set(queue[0], true);

  while (queue.length > 0) {
    let tileNum = queue.shift();
    let tile = map.get(tileNum);

    DIRECTIONS.forEach(direction => {
      let neighbor = getNeighborTile(map, alreadyFoundLocation, tile[direction]);
      if (!neighbor.found) {return};

      setCoordinates(map, alreadyFoundLocation, direction, tileNum, neighbor.tileNum);
      let matchingRotatedEdge = rotateTile(map, neighbor.tileNum, neighbor.dir, opposite(direction));
      if (tile[direction] != matchingRotatedEdge) flipTile(map, neighbor.tileNum, opposite(direction));
      queue.push(neighbor.tileNum);
    });
  }
}

const calculateGrid = (map) => {
  let res = {minX: 0, maxX: 0, minY:0, maxY: 0, gridToNum: {}};

  map.forEach(tile => {
    res.gridToNum[`${tile.x},${tile.y}`] = tile.tileNum;

    if (tile.x < res.minX) res.minX = tile.x;
    if (tile.x > res.maxX) res.maxX = tile.x;
    if (tile.y < res.minY) res.minY = tile.y;
    if (tile.y > res.maxY) res.maxY = tile.y;
  });

  return res;
}

const mergeAll = (map) => {
  let merged = [];
  let grid = calculateGrid(map);
  let tileHeight = 0;

  let currentTopRow = 0;
  for (let y = grid.maxY; y >= grid.minY; y--){
    for (let x = grid.minX; x <= grid.maxX; x++){
      let fullTile = map.get(grid.gridToNum[`${x},${y}`]).fullTile;
      let croppedTile = fullTile.slice(1,-1).map(str => str.slice(1,-1));
      tileHeight = croppedTile.length;
      croppedTile.forEach((tileRow, tileRowIndex) => {
        if (!merged[currentTopRow + tileRowIndex]) {merged[currentTopRow + tileRowIndex] = ""};
        merged[currentTopRow + tileRowIndex] += tileRow;
      })
    }
    currentTopRow += tileHeight;
  }
  
  return merged;
}

const findMonsterInLocation = (img, rowIndex, colIndex) => {
  for (let r = 0; r < MONSTER.length; r++){
    for (let c = 0; c < MONSTER[r].length; c++){
      if (MONSTER[r].charAt(c) == '#' && img[rowIndex + r].charAt(colIndex + c) != '#') return false;
    }
  }
  return true;
}

const countMonsters = (img) => {
  let monsters = 0;

  for (let rowIndex = 0; rowIndex <= img.length - MONSTER.length; rowIndex++){
    for (let colIndex = 0; colIndex <= img[rowIndex].length - MONSTER[0].length; colIndex++){
      if (findMonsterInLocation(img,rowIndex,colIndex)) monsters++;
    }
  }

  return monsters;
}

const orientateAndCountMonsters = (img) => {
  let count = 0;
  for (let possibility = 0; possibility < 8; possibility++){
    count = countMonsters(img);
    if (count > 0) break;

    //4 rotations, then flip and another 4 rotations.
    if (possibility == 3) {
      img = img.reverse();
      continue;
    }
    
    img = singleRotationOfArray(img);
  }
  return count;
}

const countHashtags = (arr) => {
  return arr.reduce((sum, row) => sum += (row.match(/#/g) || "").length, 0);
}

const goB = (input) => {
  setAllTilesLocations(input);
  let fullImage = mergeAll(input);
  return countHashtags(fullImage) - countHashtags(MONSTER) * orientateAndCountMonsters(fullImage);
}

/* Tests */

let testInput = prepareInputA(readInput("test.txt"));
test(goA(testInput), 20899048083289);
testInput = prepareInputB(readInput("test.txt"));
test(goB(testInput), 273);

/* Results */

console.time("Time");
let input = prepareInputA(readInput("input.txt"));
const resultA = goA(input);
input = prepareInputB(readInput("input.txt"));
const resultB = goB(input);
console.timeEnd("Time");

test(resultA, 11788777383197);
console.log("Solution to part 1:", resultA);
console.log("Solution to part 2:", resultB);
function seed() {
  return Array.from(arguments)
}

function same([x, y], [j, k]) {
  return x === j &&  y === k
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains([x, y]) {
  const gameState = this;
  let isLivingCell = false;
  for (const [j, k] of gameState) {
    if(x === j && y === k) isLivingCell = true;
  }
  return isLivingCell;
}

const printCell = (cell, state) => {
  const isLivingCell = contains.call(state, cell)
  return isLivingCell ? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {
  const coordinates = {
    topRight: [0, 0],
    bottomLeft: [0, 0],
  }

  if(state.length > 0){
    const xCords = [];
    const yCords = [];
    for (const [x, y] of state){
      xCords.push(x);
      yCords.push(y);
    }

    const compareFn = (a, b) => {
      if(a < b) return -1;
      if(a > b) return 1;
      return 0
    }
    xCords.sort(compareFn);
    yCords.sort(compareFn);

    coordinates.topRight = [xCords[xCords.length - 1], yCords[yCords.length - 1]];
    coordinates.bottomLeft = [xCords[0], yCords[0]];
  }

  return coordinates;
};

const printCells = (state = []) => {
  const fetchedCorners = corners(state);
  const {topRight: [maxX, maxY], bottomLeft: [minX, minY]} = fetchedCorners;
  const rows = []
  for (let i = maxY; i > minY - 1; i--){
    const row = []
    for (let j = minX; j < maxX + 1; j++){
      const rowItem = [j, i];
      row.push(rowItem)
    }
    const stateWithinRange = state.filter(([x, y]) => y === i)
    const cellStringArr = row.map((cell) => printCell(cell, stateWithinRange))
    const cellString = `${cellStringArr.join(" ")}\n`;
    rows.push(cellString)
  }

  const fullCellString = rows.join("")
  
  return fullCellString
};

const getNeighborsOf = ([x, y]) => [[x-1, y-1], [x, y-1], [x-1, y], [x+1, y+1], [x, y+1], [x+1, y], [x+1, y-1], [x-1, y+1]];

const getLivingNeighbors = (cell, state) => {
  const containsFn = contains.bind(state);
  const neighbors = getNeighborsOf(cell);
  const livingNeighbors = neighbors.filter(neighbor => containsFn(neighbor))
  return livingNeighbors
};

const willBeAlive = (cell, state) => {
  const livingNeighbors = getLivingNeighbors(cell, state);
  if(livingNeighbors.length === 3) return true;
  if(livingNeighbors.length === 2 && contains.call(state, cell)) return true;
  return false;
};

const calculateNext = (state) => {
  const fetchedCorners = corners(state);
  let {topRight: [maxX, maxY], bottomLeft: [minX, minY]} = fetchedCorners;
  const [maxBoundX, maxBoundY] = [maxX, maxY].map(v => v + 1)
  const [minBoundX, minBoundY] = [minX, minY].map(v => v - 1)

  let rows = []
  for (let i = maxBoundY; i > minBoundY - 1; i--){
    const row = []
    for (let j = minBoundX; j < maxBoundX + 1; j++){
      const rowItem = [j, i];
      if(willBeAlive(rowItem, state)) row.push(rowItem)
    }
    rows = rows.concat(row)
  }

  return rows;
};

const iterate = (state, iterations) => {
  const states = [state];
  for(let i = 0; i < iterations; i++){
    state = calculateNext(state)
    states.push(state)
  }
  return states
};

const main = (pattern, iterations) => {
  const state = startPatterns[pattern];
  const states = iterate(state, iterations);
  states.forEach(r => console.log(printCells(r)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;
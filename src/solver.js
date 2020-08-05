//import pull from 'lodash/pull';

const pull = require('lodash/pull');

const mock = [
  [2, 1, 5, 0, 6, 4, 7, 8, 9],
  [7, 0, 6, 1, 5, 8, 3, 0, 0],
  [8, 3, 0, 7, 2, 9, 5, 6, 0],
  [6, 7, 0, 5, 0, 2, 8, 4, 1],
  [0, 1, 0, 8, 4, 3, 2, 6, 7],
  [4, 0, 2, 1, 0, 6, 0, 0, 5],
  [0, 3, 6, 0, 0, 0, 0, 5, 8],
  [4, 8, 9, 5, 3, 1, 0, 7, 2],
  [2, 5, 0, 6, 4, 8, 0, 0, 0],
];

function getNumberByCoords(arr, x, y) {
  const numberOfQuadrants = arr.length;
  const dimensionSize = Math.sqrt(numberOfQuadrants);

  if (x >= numberOfQuadrants || y >= numberOfQuadrants) {
    throw new TypeError('Недопустимые координаты');
  }

  const quadrant = Math.floor(x / dimensionSize) * dimensionSize + Math.floor(y / dimensionSize);
  const quadrantX = x % dimensionSize;
  const quadrantY = y % dimensionSize;
  const index = quadrantX * dimensionSize + quadrantY;

  return arr[quadrant][index];
}

function createTwoDimArrFromQuadrants(quadrantsArr) {
  const numberOfQuadrants = quadrantsArr.length;
  const dimensionSize = Math.sqrt(numberOfQuadrants);

  const twoDimArr = new Array(dimensionSize);

  for (let i = 0; i < numberOfQuadrants ; twoDimArr[i++] = []);

  for (let i = 0; i < numberOfQuadrants; i++) {
    for (let j = 0; j < numberOfQuadrants; j++ ){
      twoDimArr[i][j] = getNumberByCoords(quadrantsArr, i, j);
    }
  }

  return twoDimArr;
}

function validateSudoku(quadrantsArr) {
  const numberOfQuadrants = quadrantsArr.length;
  const dimensionSize = Math.sqrt(numberOfQuadrants);

  if (dimensionSize % 1 !== 0) {
    throw new TypeError('Длина массива значений квадрантов должна быть квадратом натурального числа');
  }

  for (const quadrant of quadrantsArr) {
    if(quadrant.length !== dimensionSize * dimensionSize) {
      throw new TypeError('Длина массива значений квадранта должна быть квадратом размерности судоку');
    }
  }

  for (const quadrant of quadrantsArr) {
    const zerolessArr = pull([...quadrant], 0);
    const set = new Set(zerolessArr);

    if (set.size !== zerolessArr.length) {
      return false;
    }
  }

  const twoDimArr = createTwoDimArrFromQuadrants(quadrantsArr);

  for (const lineX of twoDimArr) {
    const zerolessArr = pull([...lineX], 0);
    const set = new Set(zerolessArr);

    if (set.size !== zerolessArr.length) {
      return false;
    }
  }

  for (let i = 0; i < numberOfQuadrants; i++) {
    const lineY = [];

    for (let j=0; j < numberOfQuadrants; j++) {
      lineY.push(twoDimArr[i][j]);
    }

    const zerolessArr = pull([...lineY], 0);
    const set = new Set(zerolessArr);

    if (set.size !== zerolessArr.length) {
      return false;
    }

    return true;
  }

}

console.log(validateSudoku(mock));
console.log(createTwoDimArrFromQuadrants(mock));

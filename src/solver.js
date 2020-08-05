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

function transformToTwoDimArr(quadrantsArr) {
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

  const twoDimArr = new Array(dimensionSize);

  for (let i = 0; i < numberOfQuadrants ; twoDimArr[i++] = []);

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

  for (let i = 0; i < numberOfQuadrants; i++) {
    for (let j = 0; j < numberOfQuadrants; j++ ){
      twoDimArr[i][j] = getNumberByCoords(quadrantsArr, i, j);
    }
  }

  return twoDimArr;

}

console.log(transformToTwoDimArr(mock));

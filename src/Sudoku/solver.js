import pull from 'lodash/pull';
import { Cell } from './cell';
import cloneDeep from 'lodash/cloneDeep';

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
]; //Zero means empty cell

export class Sudoku {
  constructor(quadrantsArr) {
    this.sudokuDefinition = cloneDeep(quadrantsArr);
    this.sudokuSize = this.sudokuDefinition.length;
    this.quadrantSize = Math.sqrt(this.sudokuSize);

    this.cells = [];

    for (let row = 0; row < this.sudokuSize; row++) {
      for (let column = 0; column < this.sudokuSize; column++) {
        this.cells.push(
          new Cell({
            row: row,
            column: column,
            value: this.getValueByCoords(row, column),
            quadrant: this.getQuadrantByCoords(row, column),
            sudokuSize: this.sudokuSize,
          })
        );
      }
    }

    this.validateSudokuDimension();

    this.cellQuadrants = new Array(this.sudokuSize).fill('').map(() => []);
    this.cellColumns = new Array(this.sudokuSize).fill('').map(() => []);
    this.cellRows = new Array(this.sudokuSize).fill('').map(() => []);

    for (const cell of this.cells) {
      this.cellQuadrants[cell.quadrant].push(cell);
      this.cellRows[cell.row].push(cell);
      this.cellColumns[cell.column].push(cell);
    }

    this.validateSudoku();
  }

  validateSudokuDimension() {
    if (this.quadrantSize % 1 !== 0) {
      throw new TypeError(
        'Длина массива значений квадрантов должна быть квадратом натурального числа'
      );
    }

    for (const quadrant of this.sudokuDefinition) {
      if (quadrant.length !== this.quadrantSize * this.quadrantSize) {
        throw new TypeError(
          'Длина массива значений квадранта должна быть квадратом размерности судоку'
        );
      }
    }
  }

  getQuadrantByCoords(row, columm) {
    return (
      Math.floor(row / this.quadrantSize) * this.quadrantSize +
      Math.floor(columm / this.quadrantSize)
    );
  }

  getValueByCoords(row, column) {
    if (row >= this.sudokuSize || column >= this.sudokuSize) {
      throw new TypeError('Недопустимые координаты');
    }

    const quadrant = this.getQuadrantByCoords(row, column);
    const quadrantRow = row % this.quadrantSize;
    const quadrantColumn = column % this.quadrantSize;
    const index = quadrantRow * this.quadrantSize + quadrantColumn;

    return this.sudokuDefinition[quadrant][index];
  }

  validateSudoku() {
    const isColumnsInvalid = this.hasDuplicateValues(this.cellColumns);
    const isRowsInvalid = this.hasDuplicateValues(this.cellRows);
    const isQuadrantsInvalid = this.hasDuplicateValues(this.cellQuadrants);

    if (isColumnsInvalid) {
      throw new Error('Ошибка! Дублирование значений в столбцах.');
    }

    if (isRowsInvalid) {
      throw new Error('Ошибка! Дублирование значений в строках.');
    }

    if (isQuadrantsInvalid) {
      throw new Error('Ошибка! Дублирование значений в квадрантах.');
    }
  }

  hasDuplicateValues(arr) {
    for (const elem of arr) {
      const values = elem.map((cell) => cell.value);
      pull(values, 0); //Zero means empty cell and is not a duplicate value
      const set = new Set(values);

      if (set.size !== values.length) {
        return true;
      }

      return false;
    }
  }

  updatePossibleValues() {
    let isSomethingRemoved = this.updateByValues();
    
    this.cellQuadrants.forEach((cellBlock) =>
      this.updateByUniquePossibleValueInBlock(cellBlock)
    );
    this.cellRows.forEach((cellBlock) =>
      this.updateByUniquePossibleValueInBlock(cellBlock)
    );
    this.cellColumns.forEach((cellBlock) =>
      this.updateByUniquePossibleValueInBlock(cellBlock)
    );

    return isSomethingRemoved;
  }

  updateByValues() {
    let isSomethingRemoved = false;
    for (const cell of this.cells) {
      const { value, quadrant, row, column } = cell;

      if (value !== 0) {
        for (const iteratingCell of this.cellQuadrants[quadrant]) {
          if (iteratingCell !== cell) {
            const isRemoved = iteratingCell.removePossibleValue(value);

            if (isRemoved) {
              isSomethingRemoved = true;
            }
          }
        }

        for (const iteratingCell of this.cellRows[row]) {
          if (iteratingCell !== cell) {
            const isRemoved = iteratingCell.removePossibleValue(value);

            if (isRemoved) {
              isSomethingRemoved = true;
            }
          }
        }

        for (const iteratingCell of this.cellColumns[column]) {
          if (iteratingCell !== cell) {
            const isRemoved = iteratingCell.removePossibleValue(value);

            if (isRemoved) {
              isSomethingRemoved = true;
            }
          }
        }
      }
    }

    return isSomethingRemoved;
  }

  updateByUniquePossibleValueInBlock(cellBlock) {
    // block is row, column, or quadrant
    const possibleValueToCellsMap = new Map();

    for (let value = 1; value <= this.sudokuSize; value++) {
      possibleValueToCellsMap.set(value, []);
    }

    for (const cell of cellBlock) {
      for (const value of cell.possibleValues.values()) {
        possibleValueToCellsMap.get(value).push(cell);
      }
    }

    for (const [value, cells] of possibleValueToCellsMap) {
      if (cells.length === 1) {
        cells[0].setValue(value);
      }
    }
  }

  getValuesByQuadrant() {
    const values = [];

    for (const quadrant of this.cellQuadrants) {
      values.push(quadrant.map((cell) => cell.value));
    }
    return values;
  }

  getValues() {
    return this.getValuesByQuadrant().flat();
  }

  solveUntillLoop() {
    let isSomethingIsRemoved;

    do {
      isSomethingIsRemoved = this.updatePossibleValues();
    } while (isSomethingIsRemoved);
  }

  solve() {
    this.solveUntillLoop();
  }
}

const sudoku = new Sudoku(mock);

console.log(sudoku.getValues());
sudoku.solveUntillLoop();
console.log(sudoku.getValues());

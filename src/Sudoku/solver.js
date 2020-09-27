import { Cell } from './cell';
import cloneDeep from 'lodash/cloneDeep';

const mock = [
  [0, 1, 2, 0, 0, 0, 5, 0, 0],
  [4, 0, 0, 6, 0, 0, 0, 9, 2],
  [9, 0, 7, 0, 0, 2, 0, 0, 4],
  [0, 0, 8, 4, 0, 5, 7, 0, 0],
  [0, 0, 0, 8, 0, 0, 0, 0, 0],
  [0, 1, 9, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 5, 0, 4, 7, 0, 0],
  [8, 0, 0, 0, 2, 0, 3, 0, 0],
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

    this.cellQuadrants = Array.from(new Array(this.sudokuSize)).map(() => []);
    this.cellColumns = Array.from(new Array(this.sudokuSize)).map(() => []);
    this.cellRows = Array.from(new Array(this.sudokuSize)).map(() => []);

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

  checkIfSolved() {
    return this.cells.every((cell) => cell.value !== 0);
  }

  hasDuplicateValues(arr) {
    for (const elem of arr) {
      const values = elem
        .map((cell) => cell.value)
        .filter((value) => value !== 0);
      const set = new Set(values);

      if (set.size !== values.length) {
        return true;
      }
    }

    return false;
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

  updateHintsByValues() {
    let someHintsWereUpdated = false;

    for (const cell of this.cells) {
      const { value, quadrant, row, column } = cell;

      if (value !== 0) {
        for (const iteratingCell of this.cellQuadrants[quadrant]) {
          if (iteratingCell !== cell) {
            const isRemoved = iteratingCell.removeHint(value);

            if (isRemoved) {
              someHintsWereUpdated = true;
            }
          }
        }

        for (const iteratingCell of this.cellRows[row]) {
          if (iteratingCell !== cell) {
            const isRemoved = iteratingCell.removeHint(value);

            if (isRemoved) {
              someHintsWereUpdated = true;
            }
          }
        }

        for (const iteratingCell of this.cellColumns[column]) {
          if (iteratingCell !== cell) {
            const isRemoved = iteratingCell.removeHint(value);

            if (isRemoved) {
              someHintsWereUpdated = true;
            }
          }
        }
      }
    }

    return someHintsWereUpdated;
  }

  updateValuesByHints() {
    this.cells.forEach((cell) => cell.calculateValue());
  }

  updateValuesByHintsUntillLoop() {
    let someHintsWereUpdated = false;

    do {
      someHintsWereUpdated = this.updateHintsByValues();

      if (someHintsWereUpdated) {
        this.updateValuesByHints();
      }
    } while (someHintsWereUpdated);

    return false;
  }
  
  createHintToCellsMap(cellBlock) {
    const hintToCellsMap = new Map();

    for (let value = 1; value <= this.sudokuSize; value++) {
      hintToCellsMap.set(value, []);
    }

    for (const cell of cellBlock) {
      for (const value of cell.hints.values()) {
        hintToCellsMap.get(value).push(cell);
      }
    }

    return hintToCellsMap;
  }

  updateValuesByUniqueHintInBlock(cellBlock) {
    // block is row, column, or quadrant
    const hintToCellsMap = this.createHintToCellsMap(cellBlock);
    let somethingWasSet = false;

    for (const [value, cells] of hintToCellsMap) {
      if (cells.length === 1) {
        cells[0].setValue(value);
        this.updateHintsByValues();
        somethingWasSet = true;
      }
    }

    return somethingWasSet;
  }

  updateValuesByUniqueHints() {
    let someValuesWereUpdated = false;

    for (const quadrant of this.cellQuadrants) {
      const quadrantValuesWereUpdated = this.updateValuesByUniqueHintInBlock(
        quadrant
      );

      if (quadrantValuesWereUpdated) {
        someValuesWereUpdated = true;
      }
    }

    for (const row of this.cellRows) {
      const quadrantValuesWereUpdated = this.updateValuesByUniqueHintInBlock(
        row
      );

      if (quadrantValuesWereUpdated) {
        someValuesWereUpdated = true;
      }
    }

    for (const column of this.cellColumns) {
      const columnValuesWereUpdated = this.updateValuesByUniqueHintInBlock(
        column
      );

      if (columnValuesWereUpdated) {
        someValuesWereUpdated = true;
      }
    }

    return someValuesWereUpdated;
  }

  checkIsAllCellsInOneBlock(cells, cellBlockType) {
    if (
      cellBlockType !== 'row' ||
      cellBlockType !== 'column' ||
      cellBlockType !== 'quadrant'
    ) {
      throw new TypeError(`${cellBlockType} is not a valid cellBlockType`);
    }
    const firstCellBlock = cells[0][cellBlockType];

    return cells.every((cell) => cell[cellBlockType] === firstCellBlock);
  }

  isCellInArray(cell, cellArr) {
    return cellArr.some((cellInArr) => cellInArr === cell);
  }

  removeHintsFromOtherCellsInBlock(
    hintValue,
    cellsWithThisHint,
    cellBlockType
  ) {
    const cell = cellsWithThisHint[0];
    const cellBlockIndex = cell[cellBlockType];
    let isRemoved = false;

    switch (cellBlockIndex) {
      case 'quadrant':
        for (const iteratingCell of this.cellQuadrants[cellBlockIndex]) {
          if (!this.isCellInArray(iteratingCell, cellsWithThisHint)) {
            iteratingCell.removeHint(hintValue);
            isRemoved = true;
          }
        }
        break;

      case 'row':
        for (const iteratingCell of this.cellRows[cellBlockIndex]) {
          if (!this.isCellInArray(iteratingCell, cellsWithThisHint)) {
            iteratingCell.removeHint(hintValue);
            isRemoved = true;
          }
        }
        break;

      case 'column':
        for (const iteratingCell of this.cellColumns[cellBlockIndex]) {
          if (!this.isCellInArray(iteratingCell, cellsWithThisHint)) {
            iteratingCell.removeHint(hintValue);
            isRemoved = true;
          }
        }
        break;

      default:
        throw new TypeError(`${cellBlockType} is not a valid cellBlockType`);
    }

    return isRemoved;
  }

  solve() {
    do {
      this.updateValuesByHintsUntillLoop();
      this.updateValuesByUniqueHints();
      this.updateValuesByContradiction();
    } while (!this.checkIfSolved());
  }

  recursiveMethod() {
    if (this.checkIfSolved()) {
      return true;
    }
    const sudoku = deepclo
    sudoku.updateHintsByValues();

    // выставляем предположение

    sudoku.solve();

    return true;

  }
}

const sudoku = new Sudoku(mock);
sudoku.updateHintsByValues();

console.log(sudoku.createHintToCellsMap(sudoku.cellQuadrants[0]));

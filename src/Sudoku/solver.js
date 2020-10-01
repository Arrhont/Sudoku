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

    for (let rowIndex = 0; rowIndex < this.sudokuSize; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.sudokuSize; columnIndex++) {
        this.cells.push(
          new Cell({
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            value: this.getValueByCoords(rowIndex, columnIndex),
            quadrantIndex: this.getQuadrantByCoords(rowIndex, columnIndex),
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
      this.cellQuadrants[cell.quadrantIndex].push(cell);
      this.cellRows[cell.rowIndex].push(cell);
      this.cellColumns[cell.columnIndex].push(cell);
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

  getQuadrantByCoords(rowIndex, colummIndex) {
    return (
      Math.floor(rowIndex / this.quadrantSize) * this.quadrantSize +
      Math.floor(colummIndex / this.quadrantSize)
    );
  }

  getValueByCoords(rowIndex, columnIndex) {
    if (rowIndex >= this.sudokuSize || columnIndex >= this.sudokuSize) {
      throw new TypeError('Недопустимые координаты');
    }

    const quadrantIndex = this.getQuadrantByCoords(rowIndex, columnIndex);
    const quadrantRowIndex = rowIndex % this.quadrantSize;
    const quadrantColumnIndex = columnIndex % this.quadrantSize;
    const indexInQuadrant = quadrantRowIndex * this.quadrantSize + quadrantColumnIndex;

    return this.sudokuDefinition[quadrantIndex][indexInQuadrant];
  }

  validateSudoku() {
    const hasDuplicateValuesInColumns = this.hasDuplicateValues(this.cellColumns);
    const hasDuplicateValuesInRows = this.hasDuplicateValues(this.cellRows);
    const hasDuplicateValuesInQuadrants = this.hasDuplicateValues(this.cellQuadrants);

    if (hasDuplicateValuesInColumns) {
      console.log(this.getValuesByRows());
      throw new Error('Ошибка! Дублирование значений в столбцах.');
    }

    if (hasDuplicateValuesInRows) {
      console.log(this.getValuesByRows());
      throw new Error('Ошибка! Дублирование значений в строках.');
    }

    if (hasDuplicateValuesInQuadrants) {
      console.log(this.getValuesByRows());
      throw new Error('Ошибка! Дублирование значений в квадрантах.');
    }
  }

  checkIfSolved() {
    return this.cells.every((cell) => cell.value !== 0);
  }

  checkIfContradiction() {
    const hasEmptyCellsWithoutHints = this.cells.some(
      (cell) => cell.value === 0 && cell.hints.size === 0
    );
    const hasDuplicateValuesInColumns = this.hasDuplicateValues(this.cellColumns);
    const hasDuplicateValuesInRows = this.hasDuplicateValues(this.cellRows);
    const hasDuplicateValuesInQuadrants = this.hasDuplicateValues(this.cellQuadrants);

    if (
      hasEmptyCellsWithoutHints ||
      hasDuplicateValuesInColumns ||
      hasDuplicateValuesInRows ||
      hasDuplicateValuesInQuadrants
    ) {
      return true;
    }

    return false;
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

  getValuesByQuadrants() {
    const values = [];

    for (const quadrant of this.cellQuadrants) {
      values.push(quadrant.map((cell) => cell.value));
    }

    return values;
  }

  getValuesByRows() {
    const values = [];

    for (const row of this.cellRows) {
      values.push(row.map((cell) => cell.value));
    }

    return values;
  }

  getValues() {
    return this.getValuesByQuadrants().flat();
  }

  setCellValues(cells) {
    this.cells.forEach((cell, index) => {
      cell.value = cells[index].value;
    });
  }

  clone() {
    const newData = this.getValuesByQuadrants();
    const newSudoku = new Sudoku(newData);

    newSudoku.cells.forEach((cell, cellIndex) => {
      cell.hints = new Set(this.cells[cellIndex].hints);
    });

    return newSudoku;
  }

  updateHintsByCellValueInBlock(cell, cellBlock) {
    let someHintsWereUpdated = false;

    for (const cellInBlock of cellBlock) {
      if (cellInBlock !== cell) {
        const hintIsRemoved = cellInBlock.removeHint(cell.value);

        if (hintIsRemoved) {
          someHintsWereUpdated = true;
        }
      }
    }

    return someHintsWereUpdated;
  }

  updateHintsByValues() {
    let someHintsWereUpdated = false;

    for (const cell of this.cells) {
      const { value, quadrantIndex, rowIndex, columnIndex} = cell;

      const cellQuadrant = this.cellQuadrants[quadrantIndex];
      const cellRow = this.cellRows[rowIndex];
      const cellColumn = this.cellColumns[columnIndex];

      if (value !== 0) {
        const hintsInQuadrantWereUpdated = this.updateHintsByCellValueInBlock(cell, cellQuadrant);
        const hintsInRowWereUpdated = this.updateHintsByCellValueInBlock(cell, cellRow);
        const hintsInColumnWereUpdated = this.updateHintsByCellValueInBlock(cell, cellColumn);

        if(
          hintsInQuadrantWereUpdated || hintsInRowWereUpdated || hintsInColumnWereUpdated) {
          someHintsWereUpdated = true;
        }
      }
    }

    return someHintsWereUpdated;
  }

  updateValuesByHints() {
    this.cells.forEach((cell) => cell.calculateValue());
  }

  solve() {
    do {
      if (this.checkIfContradiction()) {
        return false;
      }

      const canContinueSolvingByHints = this.updateHintsByValues();
      this.updateValuesByHints();

      if (!canContinueSolvingByHints) {
        if (this.checkIfSolved()) {
          return true;
        }

        this.updateValuesByContradiction();
      }
      // необязательная проверка, сработает check выше, оставлю для красоты.
    } while (!this.checkIfSolved()); 

    return true;
  }

  updateValuesByContradiction() {
    const sudoku = this.clone();

    if (sudoku.checkIfContradiction()) {
      return false;
    }

    const assumptionTarget = sudoku.makeAssumption();
    const hint = Array.from(assumptionTarget.hints)[0];

    assumptionTarget.setValue(hint);

    const isAssumptionTrue = sudoku.solve();

    if (!isAssumptionTrue) {
      this.cells
        .find((cell) => cell.id === assumptionTarget.id)
        .removeHint(hint);
    } else {
      this.setCellValues(sudoku.cells);
    }

    return true;
  }

  defineMaxLength(assumptionAccumulator, cellBlocks) {
    for (const cellBlock of cellBlocks) {
      const numberOfValues = cellBlock
        .map((cell) => cell.value)
        .filter((value) => value !== 0).length;

      if (
        assumptionAccumulator.numberOfValues < numberOfValues &&
        numberOfValues < this.sudokuSize
      ) {
        assumptionAccumulator.cellBlock = cellBlock;
        assumptionAccumulator.numberOfValues = numberOfValues;
      }
    }
  }

  makeAssumption() {
    const assumptionAccumulator = {
      cellBlock: null,
      numberOfValues: -1,
    };

    this.defineMaxLength(assumptionAccumulator, this.cellQuadrants);
    this.defineMaxLength(assumptionAccumulator, this.cellRows);
    this.defineMaxLength(assumptionAccumulator, this.cellColumns);

    const assumptionTarget = assumptionAccumulator.cellBlock.find(
      (cell) => cell.value === 0
    );

    return assumptionTarget;
  }
}
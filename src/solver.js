//import pull from 'lodash/pull';

const pull = require('lodash/pull');
const cloneDeep = require('lodash/cloneDeep');

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

class Cell {
    constructor(cellData) {
        this.id = cellData.row + '_' + cellData.column;
        this.value = cellData.value;
        this.row = cellData.row;
        this.column = cellData.column;
        this.sudokuSize = cellData.sudokuSize;
        this.quadrant = cellData.quadrant;

        const possibleValues = new Set();
        for (let i = 0; i < this.sudokuSize; i++) {
            possibleValues.add(i + 1);
        }

        this.possibleValues =
            this.value === 0 ? possibleValues : new Set([cellData.value]);
    }

    removePossibleValue(value) {
        this.possibleValues.delete(value);
    }

    tryToCalculateValue() {
        if (this.possibleValues.size === 1) {
            for (const lastValue of this.possibleValues) {
                this.value = lastValue;
            }
        }
    }
}

class Sudoku {
    constructor(quadrantsArr) {
        this.sudokuDefinition = cloneDeep(quadrantsArr);
        this.cells = [];

        this.numberOfQuadrants = this.sudokuDefinition.length;
        this.dimensionSize = Math.sqrt(this.numberOfQuadrants);

        this.validateSudokuDimension();

        this.quadrants = new Array(this.numberOfQuadrants);
        this.columns = new Array(this.numberOfQuadrants);
        this.rows = new Array(this.numberOfQuadrants);

        for (let i = 0; i < this.numberOfQuadrants; i++) {
            this.quadrants[i] = [];
            this.columns[i] = [];
            this.rows[i] = [];
        }

        for (let i = 0; i < this.numberOfQuadrants; i++) {
            for (let j = 0; j < this.numberOfQuadrants; j++) {
                this.cells.push(
                    new Cell({
                        row: i,
                        column: j,
                        value: this.getValueByCoords(i, j),
                        quadrant: this.getQuadrantByCoords(i, j),
                        sudokuSize: this.numberOfQuadrants,
                    })
                );
            }
        }

        for (const cell of this.cells) {
            this.quadrants[cell.quadrant].push(cell);
            this.rows[cell.row].push(cell);
            this.columns[cell.column].push(cell);
        }

        this.validateSudoku();
    }

    validateSudokuDimension() {
        if (this.dimensionSize % 1 !== 0) {
            throw new TypeError(
                'Длина массива значений квадрантов должна быть квадратом натурального числа'
            );
        }

        for (const quadrant of this.sudokuDefinition) {
            if (quadrant.length !== this.dimensionSize * this.dimensionSize) {
                throw new TypeError(
                    'Длина массива значений квадранта должна быть квадратом размерности судоку'
                );
            }
        }
    }

    getQuadrantByCoords(x, y) {
        return (
            Math.floor(x / this.dimensionSize) * this.dimensionSize +
            Math.floor(y / this.dimensionSize)
        );
    }

    getValueByCoords(x, y) {
        if (x >= this.numberOfQuadrants || y >= this.numberOfQuadrants) {
            throw new TypeError('Недопустимые координаты');
        }

        const quadrant = this.getQuadrantByCoords(x, y);
        const quadrantX = x % this.dimensionSize;
        const quadrantY = y % this.dimensionSize;
        const index = quadrantX * this.dimensionSize + quadrantY;

        return this.sudokuDefinition[quadrant][index];
    }

    validateSudoku() {
        const isColumnsValid = this.validate(this.columns);
        const isRowsValid = this.validate(this.rows);
        const isQuadrantsValid = this.validate(this.quadrants);

        if (!isColumnsValid) {
            throw new Error('Ошибка! Дублирование значений в столбцах.');
        }

        if (!isRowsValid) {
            throw new Error('Ошибка! Дублирование значений в строках.');
        }

        if (!isQuadrantsValid) {
            throw new Error('Ошибка! Дублирование значений в квадрантах.');
        }
    }

    validate(arr) {
        for (const elem of arr) {
            const values = elem.map((cell) => cell.value);
            pull(values, 0);
            const set = new Set(values);

            if (set.size !== values.length) {
                return false;
            }

            return true;
        }
    }

    calculateNewPossibleValues() {
        for (const cell of this.cells) {
            const { value, quadrant, row, column } = cell;

            if (value !== 0) {
                this.cells.forEach((iteratingCell) => {
                    if (iteratingCell === cell) {
                        return;
                    }
                    if (iteratingCell.id === '1_0') {
                    }

                    if (
                        iteratingCell.row === row ||
                        iteratingCell.column === column ||
                        iteratingCell.quadrant === quadrant
                    ) {
                        iteratingCell.removePossibleValue(value);
                    }
                });
            }
        }
    }

    determineValues() {
        for (let cell of this.cells) {
            cell.tryToCalculateValue();
        }
    }

    getValues() {
        const values = [];

        for (const quadrant of this.quadrants) {
            values.push(quadrant.map((cell) => cell.value));
        }

        return values;
    }
}

const sudoku = new Sudoku(mock);
console.log(sudoku.getValues())
sudoku.calculateNewPossibleValues();
sudoku.determineValues();
sudoku.calculateNewPossibleValues();
sudoku.determineValues();
sudoku.calculateNewPossibleValues();
sudoku.determineValues();
sudoku.calculateNewPossibleValues();
sudoku.determineValues();
sudoku.calculateNewPossibleValues();
sudoku.determineValues();
console.log(sudoku.getValues());



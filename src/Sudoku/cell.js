export class Cell {
  constructor(cellData) {
    this.id = cellData.row + '_' + cellData.column;
    this.value = cellData.value;
    this.row = cellData.row;
    this.column = cellData.column;
    this.sudokuSize = cellData.sudokuSize;
    this.quadrant = cellData.quadrant;

    const hints = new Set();
    for (let i = 0; i < this.sudokuSize; i++) {
      hints.add(i + 1);
    }

    this.hints = this.value === 0 ? hints : new Set();
  }

  removeHint(value) {
    const isRemoved = this.hints.delete(value);

    return isRemoved;
  }

  calculateValue() {
    if (this.hints.size === 1) {
      [this.value] = this.hints.values();
      this.hints = new Set();
    }
  }

  setValue(value) {
    if (this.value !== 0) {
      return;
    }

    // if (this.hints.size === 0) {
    //   throw new Error('Setting an already calculated value');
    // }

    if (this.hints.has(value)) {
      this.hints = new Set();
      this.value = value;
    }
  }
}

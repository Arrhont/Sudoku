export class Cell {
  constructor(cellData) {
    this.id = cellData.rowIndex + '_' + cellData.columnIndex;
    this.value = cellData.value;
    this.rowIndex = cellData.rowIndex;
    this.columnIndex = cellData.columnIndex;
    this.quadrantIndex = cellData.quadrantIndex;
    this.sudokuSize = cellData.sudokuSize;

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

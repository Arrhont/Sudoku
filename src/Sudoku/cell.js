
export class Cell {
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
      if (this.possibleValues.size === 1 && this.possibleValues.has(value)) {
          throw new Error(`Cell ${this.id} has no possible values left`);
      }

      this.possibleValues.delete(value);
  }

  tryToCalculateValue() {
      if (this.possibleValues.size === 1) {
          for (const lastValue of this.possibleValues) {
              this.value = lastValue;
          }
      }
  }

  setValue(value) {
      if(this.possibleValues.size === 1) {
          throw new Error('Setting an already calculated value');
      }

      if(this.possibleValues.has(value)) {
          this.possibleValues = new Set([value]);
          this.value = value;
      }
  }
}
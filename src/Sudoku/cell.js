
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
          this.value === 0 ? possibleValues : new Set();
  }

  removePossibleValue(value) {

      const isRemoved = this.possibleValues.delete(value);

      if (this.possibleValues.size === 1) {
          [this.value] = this.possibleValues.values();
          this.possibleValues = new Set();
      }
      

    return isRemoved;
  }

  setValue(value) {
      if(this.value !== 0) {
          return;
      }

      if(this.possibleValues.size === 0) {
          throw new Error('Setting an already calculated value');
      }

      if(this.possibleValues.has(value)) {
          this.possibleValues = new Set();
          this.value = value;
      }
  }
}
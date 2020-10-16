export class ClassName {
  constructor(className) {
    this.value = String(className);
  }

  toString() {
    return this.value;
  }

  addByCondition(condition, value) {
    if (condition) {
      this.value += ' ';
      this.value += value;
    }

    return this;
  }
}
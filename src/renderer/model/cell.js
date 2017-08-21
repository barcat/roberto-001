import guid from 'guid';
import Range from './range';

export default class Cell {
  constructor(rowStart, colStart) {
    this.id = guid.raw();
    this.linkedNoteId = null;
    this.range = new Range(rowStart, rowStart + 1, colStart, colStart + 1);
    this.value = null;
  }
}

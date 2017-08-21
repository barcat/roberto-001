export default class Range {
  constructor(startRow, endRow, startCol, endCol) {
    this.gridRowStart = startRow;
    this.gridRowEnd = endRow;
    this.gridColumnStart = startCol;
    this.gridColumnEnd = endCol;
  }
}

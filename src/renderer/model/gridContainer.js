import R from 'ramda';
import guid from 'guid';

export default class GridContainer {
  constructor(numberOfRows, numberOfColumns, width, lineHeight) {
    this.id = guid.raw();
    this.numberOfRows = numberOfRows;
    this.numberOfColumns = numberOfColumns;
    this.width = width;
    this.lineHeight = lineHeight;
    this.cells = [];
    this.notes = [];
    this.selectedCell = null;
    this.selectedRange = null;
    this.selectedNoteId = null;
  }

  selectCells(code) {
    if (this.selectedCell === null) {
      // find first cell id and get the cell
      const el = document.getElementById(this.cells[0].id);
      el.classList.add('selected');
      this.selectedCell = this.cells[0];
    } else if (code === 40) {
      // go down
      let r = 1;
      if (this.selectedNoteId !== null) {
        const selectedNote = this.notes.find(x => x.id === this.selectedNoteId);
        r = selectedNote.range.gridRowEnd - this.selectedCell.range.gridRowStart;
        this.deselectNote();
      }
      this.moveSelection(r, 0);
    } else if (code === 38) {
      // go up
      let r = -1;
      if (this.selectedNoteId !== null) {
        const selectedNote = this.notes.find(x => x.id === this.selectedNoteId);
        r = selectedNote.range.gridRowStart - this.selectedCell.range.gridRowEnd;
        this.deselectNote();
      }
      this.moveSelection(r, 0);
    } else if (code === 37) {
      // go left
      let c = -1;
      if (this.selectedNoteId !== null) {
        const selectedNote = this.notes.find(x => x.id === this.selectedNoteId);
        c = selectedNote.range.gridColumnStart - this.selectedCell.range.gridColumnEnd;
        this.deselectNote();
      }
      this.moveSelection(0, c);
    } else if (code === 39) {
      let c = 1;
      if (this.selectedNoteId !== null) {
        const selectedNote = this.notes.find(x => x.id === this.selectedNoteId);
        c = selectedNote.range.gridColumnEnd - this.selectedCell.range.gridColumnStart;
        this.deselectNote();
      }
      this.moveSelection(0, c);
    }
  }

  moveSelection(rChange, cChange) {
    this.selectedRange = null;
    let toSelect = null;

    const sCell = this.selectedCell.range;
    toSelect = this.cells.find((c) => {
      const res = c.range.gridColumnStart === sCell.gridColumnStart + cChange &&
        c.range.gridRowStart === sCell.gridRowStart + rChange;
      return res;
    });

    if (typeof toSelect !== 'undefined') {
      let el = document.getElementById(this.selectedCell.id);
      el.classList.remove('selected');
      if (toSelect.linkedNoteId === null) {
        el = document.getElementById(toSelect.id);
        el.classList.add('selected');
        this.selectedCell = toSelect;
      } else {
        el = document.getElementById(toSelect.linkedNoteId);
        el.classList.add('selected');
        this.selectedCell = toSelect;
        this.selectedNoteId = toSelect.linkedNoteId;
      }
    }
  }

  clearSelection() {
    const el = document.getElementById(this.selectedCell.id);
    if (el !== null) el.classList.remove('selected');
    this.selectedCell = null;
    this.selectedRange = null;
  }

  expandSelection(row, col) {
    if (this.selectedCell !== null) {
      if (this.selectedRange === null) {
        this.selectedRange = Object.assign({}, this.selectedCell.range);
      }
      const rowStart = this.selectedRange.gridRowStart;
      const rowEnd = this.selectedRange.gridRowEnd;
      const colStart = this.selectedRange.gridColumnStart;
      const colEnd = this.selectedRange.gridColumnEnd;

      if (rowStart === this.selectedCell.range.gridRowStart &&
        rowEnd + row >= this.selectedCell.range.gridRowStart + 1) {
        if (rowEnd + row <= this.numberOfRows + 1) {
          this.selectedRange.gridRowEnd = rowEnd + row;
        }
      }
      if (rowEnd === this.selectedCell.range.gridRowStart + 1 &&
        rowStart + row <= this.selectedCell.range.gridRowStart) {
        if (rowStart + row >= 1) {
          this.selectedRange.gridRowStart = rowStart + row;
        }
      }
      if (colStart === this.selectedCell.range.gridColumnStart &&
        colEnd + col >= this.selectedCell.range.gridColumnStart + 1) {
        if (colEnd + col <= this.numberOfColumns + 1) {
          this.selectedRange.gridColumnEnd = colEnd + col;
        }
      }
      if (colEnd === this.selectedCell.range.gridColumnStart + 1 &&
        colStart + col <= this.selectedCell.range.gridColumnStart) {
        if (colStart + col >= 1) {
          this.selectedRange.gridColumnStart = colStart + col;
        }
      }

      const selectedRangeEl = document.getElementById('expand');

      if (this.IfCellsAreLinked(this.selectedRange) === true) {
        selectedRangeEl.classList.remove('selectionExpand');
        selectedRangeEl.classList.add('selectionExpandConflict');
      } else {
        selectedRangeEl.classList.remove('selectionExpandConflict');
        selectedRangeEl.classList.add('selectionExpand');
      }
    }
  }

  IfCellsAreLinked(range) {
    for (let r = range.gridRowStart; r < range.gridRowEnd; r += 1) {
      for (let c = range.gridColumnStart; c < range.gridColumnEnd; c += 1) {
        const cellToLink = this.cells
          .find(x => x.range.gridRowStart === r && x.range.gridColumnStart === c);
        if (cellToLink.linkedNoteId !== null) return true;
      }
    }
    return false;
  }

  linkCellsWithNote(id, range) {
    for (let r = range.gridRowStart; r < range.gridRowEnd; r += 1) {
      for (let c = range.gridColumnStart; c < range.gridColumnEnd; c += 1) {
        const cellToLink = this.cells
          .find(x => x.range.gridRowStart === r &&
            x.range.gridColumnStart === c);
        cellToLink.linkedNoteId = id;
      }
    }
  }

  deselectNote() {
    const el = document.getElementById(this.selectedNoteId);
    el.classList.remove('selected');
    this.selectedNoteId = null;
  }

  deleteNote() {
    this.notes = R.reject(x => x.id === this.selectedNoteId, this.notes);
    this.cells
      .filter(x => x.linkedNoteId === this.selectedNoteId)
      .forEach((x) => {
        const y = x;
        y.linkedNoteId = null;
      });
    this.selectedNoteId = null;
    this.selectedCell = null;
  }
}

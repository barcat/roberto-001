<template>
  <div class="container" :style="style">
    <app-cell v-for="(c, key) in container.cells" :key="key" :id="c.id" :row="c.range.gridRowStart" :col="c.range.gridColumnStart"></app-cell>
    <app-note v-for="(n, key) in container.notes" :key="key" :id="n.id" :range="n.range" :isFocused="n.isFocused"></app-note>
    <div id="expand" v-show="container.selectedRange !== null" :style="selectedRange"> </div>
  </div>
</template>
<script>

import cell from './cell';
import note from './note';
import GridContainer from '../model/gridContainer';
import Cell from '../model/cell';
import Note from '../model/note';

export default {
  props: {
    width: {
      type: Number,
      default: 720,
    },
    numberOfColumns: {
      type: Number,
      default: 5,
    },
    numberOfRows: {
      type: Number,
      default: 30,
    },
    rowHeight: {
      type: Number,
      default: 24,
    },
  },
  data() {
    return {
      container: null,
      selectedCellId: null,
    };
  },
  created() {
    this.container = new GridContainer(
      this.numberOfRows,
      this.numberOfColumns,
      this.width,
      this.rowHeight,
    );

    if (this.container.selectedCell !== null) {
      this.selectedCellId = this.container.selectedCell.Id;
    }

    for (let r = 1; r <= this.container.numberOfRows; r += 1) {
      for (let c = 1; c <= this.container.numberOfColumns; c += 1) {
        this.container.cells.push(new Cell(r, c));
      }
    }
  },
  mounted() {
    const keyMap = { 17: false, 65: false };
    const expandDownMap = { 16: false, 40: false };
    const expandUpMap = { 16: false, 38: false };
    const expandRightMap = { 16: false, 39: false };
    const expandLeftMap = { 16: false, 37: false };
    const deleteCell = { 17: false, 68: false };

    window.addEventListener('keydown', (event) => {
      this.updateStore();
      const keyCode = event.keyCode;
      if ([40, 39, 38, 37].indexOf(keyCode) > -1) {
        if (expandDownMap[16] === false) {
          this.container.selectCells(keyCode);
        }
      }
      if (keyCode === 27) {
        if (this.$store.selectedNote !== null) {
          this.$store.selectedNote.isFocused = false;
        } else {
          this.container.clearSelection();
        }
      }

      // press enter
      if (keyCode === 13) {
        if (this.$store.selectedNote !== null) {
          this.$store.selectedNote.isFocused = true;
        }
        console.log(this.$store.selectedNote);
      }
      // add new note
      if ([17, 65].indexOf(keyCode) > -1) {
        keyMap[keyCode] = true;
        if (keyMap[17] && keyMap[65]) {
          if (this.container.selectedCell !== null) {
            if (this.container.selectedRange === null) {
              if (this.container.IfCellsAreLinked(this.container.selectedCell.range) === false) {
                const noteToAdd = new Note(this.container.selectedCell.range);
                this.container.linkCellsWithNote(noteToAdd.id, noteToAdd.range);
                this.container.notes.push(noteToAdd);
              }
            } else if (this.container.IfCellsAreLinked(this.container.selectedRange) === false) {
              const noteToAdd = new Note(this.container.selectedRange);
              this.container.selectedNoteId = noteToAdd.id;
              this.container.linkCellsWithNote(noteToAdd.id, noteToAdd.range);
              this.container.notes.push(noteToAdd);

              this.$nextTick(() => {
                const el = document.getElementById(this.container.selectedNoteId);
                el.classList.add('selected');
              });
            }
          }
        }
      }
      if ([16, 40].indexOf(keyCode) > -1) {
        expandDownMap[keyCode] = true;
        if (expandDownMap[16] && expandDownMap[40]) {
          this.container.expandSelection(1, 0);
        }
      }
      if ([16, 38].indexOf(keyCode) > -1) {
        expandUpMap[keyCode] = true;
        if (expandUpMap[16] && expandUpMap[38]) {
          this.container.expandSelection(-1, 0);
        }
      }
      if ([16, 39].indexOf(keyCode) > -1) {
        expandRightMap[keyCode] = true;
        if (expandRightMap[16] && expandRightMap[39]) {
          this.container.expandSelection(0, 1);
        }
      }
      if ([16, 37].indexOf(keyCode) > -1) {
        expandLeftMap[keyCode] = true;
        if (expandLeftMap[16] && expandLeftMap[37]) {
          this.container.expandSelection(0, -1);
        }
      }
      if ([17, 68].indexOf(keyCode) > -1) {
        deleteCell[keyCode] = true;
        if (deleteCell[17] && deleteCell[68]) {
          this.container.deleteNote();
        }
      }
    });

    window.addEventListener('keyup', (event) => {
      if (event.keyCode in keyMap) {
        keyMap[event.keyCode] = false;
      }
      if (event.keyCode in expandDownMap) {
        expandDownMap[event.keyCode] = false;
      }
      if (event.keyCode in expandUpMap) {
        expandUpMap[event.keyCode] = false;
      }
      if (event.keyCode in expandRightMap) {
        expandRightMap[event.keyCode] = false;
      }
      if (event.keyCode in expandLeftMap) {
        expandLeftMap[event.keyCode] = false;
      }
      if (event.keyCode in deleteCell) {
        deleteCell[event.keyCode] = false;
      }
    });
  },
  computed: {
    style() {
      const cellWidth = this.width / this.numberOfColumns;
      return {
        gridTemplateColumns: `repeat(${this.numberOfColumns}, ${cellWidth}px)`,
        gridTemplateRows: `repeat(${this.numberOfRows}, ${this.rowHeight}px)`,
      };
    },
    selectedRange() {
      return this.container.selectedRange;
    },
  },
  methods: {
    updateStore() {
      if (this.container.selectedNoteId !== null) {
        this.$store.selectedNote = this.container.notes
          .find(x => x.id === this.container.selectedNoteId);
      } else {
        this.$store.selectedNote = null;
      }
    },
  },
  components: {
    appCell: cell,
    appNote: note,
  },
};
</script>
<style>
.container {
  display: grid;
  grid-gap: 1px 1px;
}

.selectionExpand {
  background-color: lightgreen;
  opacity: 0.4;
  outline: green solid 1px;
}

.selectionExpandConflict {
  background-color: orange;
  opacity: 0.4;
  outline: red solid 1px;
}

.selected {
  outline: green solid 1px !important;
}
</style>

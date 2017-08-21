<template>
  <div class="cell" :style="style">
  </div>
</template>
<script>
export default {
  props: {
    row: Number,
    col: Number,
  },
  computed: {
    style() {
      return {
        gridColumnStart: this.col,
        gridColumnEnd: this.col + 1,
        gridRowStart: this.row,
        gridRowEnd: this.row + 1,
      };
    },
  },
};
</script>

<style scoped>
.cell {
  background-color: #ECEFF1;
}
.selected {
  outline: green solid 1px;
}
</style>

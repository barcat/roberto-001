<template>
  <div :style="style" class="note">
    <textarea v-show="isFocused" ref="txt" v-model="value">
    </textarea>
    <div class="value" v-show="!isFocused">
      {{ content }}
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'range',
    'isFocused',
    'content',
  ],
  data() {
    return {
      toWrite: null,
    };
  },
  watch: {
    isFocused() {
      this.$nextTick(() => this.$refs.txt.focus());
    },
    // toWrite() {
    //   this.$store.state.selectedNote.value = this.toWrite;
    //   console.log(this.toWrite);
    // },
  },
  computed: {
    value: {
      get() {
        return this.content;
      },
      set(x) {
        console.log(this);
        this.$store.state.selectedNote.value = x;
        // this.toWrite = x;
      },
    },
    style() {
      return {
        gridRowStart: this.range.gridRowStart,
        gridRowEnd: this.range.gridRowEnd,
        gridColumnStart: this.range.gridColumnStart,
        gridColumnEnd: this.range.gridColumnEnd,
      };
    },
  },
};
</script>

<style scoped>
.note {
  background: #CFD8DC;
  outline: 1px #B0BEC5 solid;
  outline-offset: -1px;
}

textarea {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  resize: none;
  line-height: 24px;
  font-size: 16px;
  border-style: none;
  border-color: Transparent;
  background: white;
  outline: 1px #B0BEC5 solid;
  outline-offset: -1px;
}

.content {
  width: 100%;
  height: 100%;
}
</style>

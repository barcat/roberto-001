<template>
  <div :style="style" class="note">
    <textarea v-show="isFocused" ref="txt">
    </textarea>
    <div class="value" v-show="!isFocused">
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'range',
    'isFocused',
  ],
  data() {
    return {
      content: '',
    };
  },
  watch: {
    isFocused() {
      console.log('focus');
      this.$nextTick(() => this.$refs.txt.focus());
      // this.$refs.txt.scrollIntoView();
      // console.log(this.$refs.txt);
    },
  },
  computed: {
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

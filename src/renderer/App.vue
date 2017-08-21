<template>
  <div id="app">
    <app-grid></app-grid>
  </div>
</template>

<script>
import grid from './components/grid';

export default {
  name: 'app',
  components: {
    appGrid: grid,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: grid;
  justify-items: center;
}
</style>

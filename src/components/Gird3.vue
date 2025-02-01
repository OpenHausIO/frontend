<template>
  <div class="grid" ref="grid">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Grid",
  props: {
    columns: {
      type: Number,
      default: 5
    },
    rows: {
      type: Number,
      default: 5
    }
  },
  watch: {
    columns: "updateGrid",
    rows: "updateGrid"
  },
  mounted() {
    this.updateGrid();
  },
  methods: {
    updateGrid() {
      const grid = this.$refs.grid;
      grid.style.gridTemplateColumns = `repeat(${this.columns}, 100px)`;
      grid.style.gridTemplateRows = `repeat(${this.rows}, 100px)`;
    }
  }
};
</script>

<style>
.grid {
  display: grid;
  gap: 2px;
  border: 2px solid #000;
  position: relative;
  background-color: #000;
}
</style>
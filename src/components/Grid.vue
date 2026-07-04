<template>
  <div class="grid-container">
    <div class="grid" :style="gridStyle" :class="{ 'show-grid': showGrid }">

      <div v-for="(item, index) in items" :key="index" class="grid-item" :style="calcPosition(item)">
        <slot name="item" :item="item" :index="index" v-bind="item">

          Item #{{ index + 1 }}

        </slot>
      </div>

    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: "Grid",
  props: {
    items: {
      type: Array,
      required: true
    },
    cols: {
      type: Number,
      default: 5
    },
    rows: {
      type: Number,
      default: 5
    },
    showGrid: {
      type: Boolean,
      default: false
    },
    gap: {
      type: Number,
      default: 0
    }
  },
  computed: {
    gridStyle() {
      return {
        "--grid-cols": this.cols,
        "--grid-rows": this.rows,
        "--grid-gap": this.gap
      }
    }
  },
  methods: {
    calcPosition(item) {
      return {
        gridColumnStart: item.position.x,
        gridColumnEnd: item.position.x + item.size.w,
        gridRowStart: item.position.y,
        gridRowEnd: item.position.y + item.size.h
      };
    }
  }
});

</script>

<style scoped>
.grid-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 0;
}

.grid {
  height: 100%;
  width: 100%;
  max-height: 100%;
  display: grid;
  grid-template-columns: repeat(var(--grid-cols), 1fr);
  grid-template-rows: repeat(var(--grid-rows), 1fr);
  gap: var(--grid-gap);
}

.grid.show-grid {
  background-image:
    linear-gradient(to right, #000, 1px, transparent 1px),
    linear-gradient(to bottom, #000, 1px, transparent 1px);
  background-size:
    calc(100% / var(--grid-cols)) 100%,
    100% calc(100% / var(--grid-rows));
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  touch-action: none;
  position: relative;
}
</style>
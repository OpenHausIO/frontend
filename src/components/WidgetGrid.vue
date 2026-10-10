<template>
  <div class="h-100 widget-grid-container">
    <div class="widget-grid" :style="gridStyle">
      <div class="widget-grid-item" v-for="item in items" :key="item._id ?? item">
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "WidgetGrid",
  props: {
    items: {
      type: Array,
      required: true,
    },
    minItemWidth: {
      type: String,
      default: "140px",
    },
    gap: {
      type: String,
      default: "0",
    },
  },
  computed: {
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(auto-fit, minmax(${this.minItemWidth}, 1fr))`,
        gap: this.gap,
      };
    },
  },
});
</script>

<style scoped>
.widget-grid-container {
  height: 100%;
}

.widget-grid {
  display: grid;
  height: 100%;
  text-align: center;
}

.widget-grid-item {
  min-height: 100px;
}
</style>
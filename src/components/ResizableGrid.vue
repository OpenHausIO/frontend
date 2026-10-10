<!--
<template>
  <div class="resizable-grid-wrapper">

    <div class="resizable-grid" :style="gridStyle">
      <slot v-for="(item, index) in items" :key="item._id ?? index" :item="item" :index="index">

        <div class="card h-100">
          <div class="card-body">
            {{ item }}
          </div>
        </div>

      </slot>
    </div>

  </div>
</template>
-->
<template>
  <div class="resizable-grid-wrapper" :style="paddingStyle">

    <div class="resizable-grid" :style="gridStyle">
      <slot v-for="(item, index) in items" :key="item._id ?? index" :name="item.slot ?? 'default'" :item="item"
        :index="index">

        <div class="card h-100">
          <div class="card-body">
            {{ item }}
          </div>
        </div>

      </slot>
    </div>

  </div>
</template>

<script>
import { settingsStore } from "../store.js";

export default {
  name: "ResizableGrid",
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  setup() {

    let settings = settingsStore();

    return {
      settings
    };

  },
  computed: {
    tileSize: {
      get() {
        return this.settings.layout.itemSize;
      },
      set(value) {
        this.settings.layout.itemSize = value;
      }
    },
    columns: {
      get() {
        return this.settings.layout.columns;
      },
      set(value) {
        this.settings.layout.columns = value;
      }
    },
    gridStyle() {
      return {
        "--tile-size": `${this.tileSize}px`,
        "--grid-gap": `${this.settings.layout.gap}px`,
        "--columns": this.columns,
        "--min-tile-size": `${this.tileSize}px`
      }
    },
    paddingStyle() {
      return {
        "padding-left": `${this.settings.layout.gap}px`,
        "padding-right": `${this.settings.layout.gap}px`
      }
    }
  }
}
</script>

<style scoped>
.resizable-grid {
  display: grid;
  /*grid-template-columns: repeat(auto-fill, minmax(var(--tile-size), 1fr));*/
  /*grid-template-columns: repeat(var(--columns), 1fr);*/
  grid-template-columns: repeat(auto-fill,
      minmax(min(100%, max(var(--min-tile-size, 100px), calc((100% - (var(--columns) - 1) * var(--grid-gap)) / var(--columns)))),
        1fr));
  gap: var(--grid-gap);
  height: 100%;
  padding: var(--grid-gap) 0;
  /*padding-top: var(--grid-gap);*/
}
</style>
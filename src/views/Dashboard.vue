<script>
import { defineComponent } from "vue";
import { widgetComponents } from "../components/Widget.vue";
import GridDraggable from "../components/GridDraggable.vue";
import { settingsStore, widgetStore } from "../store.js";

export default defineComponent({
  name: "Dashboard",
  components: {
    GridDraggable,
    ...widgetComponents
  },
  data() {
    return {
      settings: settingsStore(),
      widgetsStore: widgetStore()
    };
  },
  computed: {
    gridItems() {
      return this.widgetsStore.$state.map((item) => ({
        position: {
          x: item.x,
          y: item.y
        },
        size: {
          h: item.h,
          w: item.w
        },
        widget: item
      }));
    }
  },
  methods: {
    handlePositionUpdate({ index, position }) {
      this.widgetsStore.$state[index].x = position.x;
      this.widgetsStore.$state[index].y = position.y;
    },
    handleSizeUpdate({ index, size }) {
      this.widgetsStore.$state[index].w = size.w;
      this.widgetsStore.$state[index].h = size.h;
    }
  }
})
</script>

<template>

  <GridDraggable :items="gridItems" :cols="settings.dashboardGrid.cols" :rows="settings.dashboardGrid.rows"
    :unlocked="settings.editDashboardWidgets" @update:position="handlePositionUpdate" @update:size="handleSizeUpdate">
    <template #item="{ widget }">

      <component :is="widget.widget" :uuid="widget.uuid" :class="{
        'bg-dark': !settings.transparentDashboardWidgets,
        'bg-transparent': settings.transparentDashboardWidgets,
      }" class="h-100 w-100 d-block" />

    </template>
  </GridDraggable>

</template>
<script setup>
import { settingsStore, widgetStore } from "../store.js";
const settings = settingsStore(); // why here no .$state?!
const widgets = widgetStore().$state; // why here .$state and not in settings?
</script>

<script>
import { defineComponent } from "vue";
import Widget from "../components/Widget.vue";

import { settingsStore, widgetStore } from "../store.js";
const settings = settingsStore(); // why here no .$state?!
const widgets = widgetStore(); // why here .$state and not in settings?


const hasDemoWidget = !!widgets.$state.find(({ widget }) => {
  return widget === "Demo"
});

// add demo widget 
if (window.location.hostname === "demo.open-haus.io" && !hasDemoWidget) {
  widgets.add("Demo", {
    h: settings.dashboardGrid.rows,
    w: settings.dashboardGrid.cols
  });
}

export default defineComponent({
  components: {
    Widget,
  },
})
</script>

<template>
  <grid-layout v-model:layout="widgets" :col-num="settings.dashboardGrid.cols" :row-height="settings.dashboardGrid.rows"
    :margin="[0, 0]" :isDraggable="settings.editDashboardWidgets" :isResizable="settings.editDashboardWidgets"
    v-show="settings.showDashboardWidgets">
    <template #default="{ gridItemProps }">
      <!-- | gridItemProps props from GridLayout | -->
      <!--breakpointCols: props.cols-->
      <!--colNum: props.colNum-->
      <!--containerWidth: width.value-->
      <!--isDraggable: props.isDraggable-->
      <!--isResizable: props.isResizable-->
      <!--lastBreakpoint: lastBreakpoint.value-->
      <!--margin: props.margin-->
      <!--maxRows: props.maxRows-->
      <!--responsive: props.responsive-->
      <!--rowHeight: props.rowHeight-->
      <!--useCssTransforms: props.useCssTransforms-->
      <!--width: width.value-->
      <grid-item v-for="item in widgets" :key="item.uuid" v-bind="gridItemProps" :x="item.x" :y="item.y" :w="item.w"
        :h="item.h" :i="item.i" :class="{
    'bg-dark': !settings.transparentDashboardWidgets,
    'bg-transparent': settings.transparentDashboardWidgets,
  }" style="border: 1px solid #000">
        <Widget :name="item.widget" :uuid="item.uuid" :unlocked="settings.editDashboardWidgets">
          <!--<template #main> Widget #{{ item.i }}</template>-->
        </Widget>
      </grid-item>
    </template>
  </grid-layout>
</template>

<style scope>
.vue-grid-item {
  /* useCssTransforms="false" does not work */
  transition: none !important;
}
</style>
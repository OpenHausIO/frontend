<script setup>
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
import { defineComponent } from "vue";
import Widget from "../components/Widget.vue";
import { v4 as uuid } from "uuid";

export default defineComponent({
  components: {
    Widget,
  },
  data() {
    return {};
  },
  beforeCreate() {
    if (window.localStorage.getItem("widgets")) {
      this.layout = JSON.parse(window.localStorage.getItem("widgets"));
    } else {
      this.layout = [
        { x: 0, y: 0, w: 6, h: 12, widget: "Weather", moved: false, i: 0 },
        { x: 6, y: 0, w: 3, h: 12, widget: "Notes", moved: false, i: 1 },
        { x: 9, y: 0, w: 3, h: 12, widget: "Todo", moved: false, i: 2 },
        {
          x: 4,
          y: 12,
          w: 6,
          h: 8,
          widget: "FritzBox",
          move: false,
          moved: false,
          i: 3,
        },
        { x: 0, y: 12, w: 4, h: 18, widget: "Notes", moved: false, i: 4 },
        { x: 4, y: 20, w: 8, h: 10, widget: "Scenes", moved: false, i: 5 },
        { x: 10, y: 12, w: 2, h: 8, widget: "Alarm", moved: false, i: 6 },
      ].map((widget) => {
        widget.uuid = uuid();
        return widget;
      });
    }
  },
  methods: {
    saveLayout() {
      console.log("Saved widget layout");
      window.localStorage.setItem("widgets", JSON.stringify(this.layout));
    },
  },
  mounted() {
    window.localStorage.setItem("widgets", JSON.stringify(this.layout));
  },
});
</script>

<template>
  <grid-layout
    v-model:layout="layout"
    :col-num="settings.dashboardGrid.cols"
    :row-height="settings.dashboardGrid.rows"
    :margin="[0, 0]"
    :isDraggable="settings.editDashboardWidgets"
    :isResizable="settings.editDashboardWidgets"
    v-show="settings.showDashboardWidgets"
  >
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
      <grid-item
        v-for="item in layout"
        :key="item.uuid"
        v-bind="gridItemProps"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @resize="saveLayout()"
        @move="saveLayout()"
        @moved="saveLayout()"
        class="bg-dark"
        style="border: 1px solid #000"
      >
        <Widget :name="item.widget" :uuid="item.uuid">
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
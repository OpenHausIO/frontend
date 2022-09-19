<script>
import { defineComponent, reactive, inject } from "vue";

export default defineComponent({
  components: {},
  data() {
    return {};
  },
  beforeCreate() {
    if (window.localStorage.getItem("widgets")) {
      this.layout = JSON.parse(window.localStorage.getItem("widgets"));
    } else {
      this.layout = [
        { x: 0, y: 0, w: 2, h: 12, i: 0 },
        { x: 2, y: 0, w: 2, h: 4, i: 1 },
        { x: 4, y: 0, w: 2, h: 5, i: 2 },
        { x: 6, y: 0, w: 2, h: 3, i: 3 },
        { x: 8, y: 3, w: 2, h: 3, i: 4 },
        { x: 8, y: 0, w: 2, h: 3, i: 5 },
        { x: 0, y: 5, w: 8, h: 5, i: 6 },
        { x: 2, y: 5, w: 2, h: 5, i: 7 },
        { x: 4, y: 5, w: 2, h: 5, i: 8 },
        { x: 6, y: 3, w: 2, h: 6, i: 9 },
      ];
    }
  },
  computed: {
    settings() {
      return inject("settings");
    },
  },
  methods: {
    moved(i, x, y) {
      console.log(`Moved i:${i}; x:${x}; y:${y}`);
      window.localStorage.setItem("widgets", JSON.stringify(this.layout));
    },
    resize(i, h, w, nh, nw) {
      window.localStorage.setItem("widgets", JSON.stringify(this.layout));
    },
  },
});
</script>

<template>
  <grid-layout
    v-model:layout="layout"
    :col-num="12"
    :row-height="30"
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
        :key="item.i"
        v-bind="gridItemProps"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @resize="resize"
        @moved="moved"
        class="bg-dark p-2"
        style="border: 1px solid #000"
      >
        Widget #{{ item.i }}
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
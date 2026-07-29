<script>
import { defineComponent, defineAsyncComponent } from "vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export const menu = [];

export default defineComponent({
  name: "Empty",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  components: {
    Widget
  },
  data() {
    return {
      options: {
        showTitleboxCheckbox: false
      }
    };
  },
  menu: [],
});
</script>


<template>
  <Widget name="Empty" :uuid="uuid" :options="options" />
</template>
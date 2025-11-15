<script>
import { defineComponent } from "vue";

export const menu = [];

export default defineComponent({
  name: "Empty",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  menu: [],
});
</script>


<template></template>

<style scope>
</style>
<script>
import { defineComponent } from "vue";
import { settingsStore } from "../store.js";

export default defineComponent({
  name: "Frame",
  setup() {

    const settings = settingsStore();

    return {
      settings
    };

  }
});
</script>

<template>
  <div style="border: 1px solid #000">

    <slot></slot>

  </div>
</template>

<style scoped>
.card {
  border: 1px solid #000;
  height: 100%;
  width: 100%;
}
</style>
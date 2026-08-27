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
  <div class="">
    <div class="card bg-transparent h-100 w-100" :style="{ 'border-radius': `${settings.layout.borderRadius}px` }">
      <div class="card-body">

        <slot></slot>

      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #000;
  height: 100%;
  width: 100%;
  min-width: 0;
}

.card-body {
  min-width: 0;
  min-height: 0;
  height: 100%;
  width: 100%;
}
</style>
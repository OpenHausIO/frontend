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
  <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2" :style="{ 'padding': `${settings.layout.gap}px` }">
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
}
</style>
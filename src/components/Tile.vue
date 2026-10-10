<script setup>
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
export default {
  //props: ["href"],
  data() {
    return {
      data: {},
    };
  },
};
</script>


<template>
  <!-- 1) Remove h-100 to shrink tiles -->
  <div class="card h-100" :style="{ 'border-radius': `${settings.layout.borderRadius}px` }">
    <div class="card-body text-center">
      <div style="padding: 2rem 0">

        <slot name="icon"></slot>

        <h3 class="mt-2 d-block" :class="{ 'truncate': settings.layout.truncate }">
          <slot name="title"></slot>
        </h3>

        <slot></slot>

      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #000;
  /*background: rgba(255, 255, 255, 0.03);*/
  /*background: transparent;*/

}

/*
.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, color-mix(in srgb, var(--bs-blue) 10%, transparent) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}


.card-body {
  /*background: url("/noise.png"), rgba(0, 0, 0, var(--item-alpha));*/
/*backdrop-filter: blur(10px);*/
/*backdrop-filter: contrast(90%);*
}
*/
/*
.card {
  opacity: 0.8;
}
*/
/*
.card-body {
  background: linear-gradient(
    45deg,
    rgba(0, 36, 22, 0.421) 10%,
    rgba(9, 44, 121, 0.052) 50%,
    rgba(0, 213, 255, 0.081) 100%
  );
}
*/


.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
</style>
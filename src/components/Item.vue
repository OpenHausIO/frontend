<template>
  <Frame :style="clickable ? 'cursor: pointer;' : ''" class="h-100" @click="clickable && $emit('click', $event)">
    <div class="d-flex flex-column align-items-center justify-content-center h-100 tile-content tile-wrapper">

      <i v-if="icon" class="d-block mb-1 tile-icon" :class="icon"></i>

      <slot name="title">
        <div class="tile-title">{{ title }}</div>
      </slot>

      <div v-if="subtitle" class="tile-subtitle text-secondary">{{ subtitle }}</div>

      <slot>

      </slot>

      <div v-if="footer || room" class="tile-footer">
        <span v-if="footer" class="text-secondary fw-light d-block">{{ footer }}</span>
        <small v-if="room" class="text-secondary fw-light d-block">{{ room }}</small>
      </div>

    </div>
  </Frame>
</template>

<script>
import { defineComponent } from "vue";
import Frame from "./Frame.vue";

export default defineComponent({
  name: "Tile",
  components: { Frame },
  emits: ["click"],
  props: {
    icon: { type: String, default: null },
    title: { type: [String, Number], default: "" },
    subtitle: { type: [String, Number], default: null },
    footer: { type: [String, Number], default: null },
    room: { type: [String, Number], default: null },
    clickable: { type: Boolean, default: true }
  }
});
</script>

<style scoped>
.tile-wrapper {
  position: relative;
}

.tile-icon {
  font-size: 25px;
}

.tile-title {
  font-weight: 500;
}

.tile-subtitle {
  font-size: 0.9em;
}

.tile-footer {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
}

small {
  font-size: 10px;
}
</style>
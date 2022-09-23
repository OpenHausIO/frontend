<script>
import { defineComponent, watch } from "vue";
import dateFormat from "dateformat";

export const menu = [];

export default defineComponent({
  name: "Clock",
  data() {
    return {
      timestamp: null,
      time: dateFormat(Date.now(), "HH:MM:ss"),
      interval: null,
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.timestamp = Date.now();
      this.time = dateFormat(this.timestamp, "HH:MM:ss");
    }, 1000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
  menu: [],
});
</script>


<template>
  <div class="p-2 text-center" style="font-size: 5vw">
    {{ time }}
  </div>
</template>

<style scope>
</style>
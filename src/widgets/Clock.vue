<script>
import { defineComponent, watch } from "vue";
import dateFormat from "dateformat";

export default defineComponent({
  name: "Clock",
  data() {
    return {
      timestamp: null,
      time: dateFormat(Date.now(), "HH:mm:ss"),
      interval: null,
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.timestamp = Date.now();
      this.time = dateFormat(this.timestamp, "HH:mm:ss");
    }, 1000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
});
</script>


<template>
  <div class="p-2 text-center">
    <h2>{{ time }}</h2>
  </div>
</template>

<style scope>
</style>
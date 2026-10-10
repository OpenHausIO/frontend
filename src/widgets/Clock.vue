<script>
import { defineComponent, watch, defineAsyncComponent } from "vue";
import dateFormat from "dateformat";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "Clock",
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
      timestamp: null,
      time: dateFormat(Date.now(), "HH:MM:ss"),
      interval: null,
      menu: [/*{
        title: "Settings",
        method: "settings",
      }*/]
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
  methods: {
    selectedMenu(menu) {
      this[menu.method]();
    },
  }
});
</script>


<template>
  <Widget name="Clock" :menu="menu" @menu="selectedMenu" :uuid="uuid">

    <div style="container-type: size; height: 100%;"
      class="bg-transparent h-100 w-100 d-flex align-items-center justify-content-center">
      <span style="font-size: 17cqw; white-space: nowrap; line-height: 1;">
        {{ time }}
      </span>
    </div>

  </Widget>
</template>
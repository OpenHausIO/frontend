<script>
import { defineComponent, defineAsyncComponent } from "vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "Stopwatch",
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
      counter: 0,
      showDurationTextbox: false,
      interval: null,
      menu: []
    };
  },
  mounted() {

    let str = window.localStorage.getItem(`widget-${this.uuid}`);

    if (!str) {
      return;
    }

    let config = JSON.parse(str);

    this.title = config.title;
    this.duration = Number(config.duration || 0);
    this.counter = this.duration;

  },
  methods: {
    resetCounter() {
      this.counter = 0;
      clearInterval(this.interval);
    },
    startCounter() {

      this.interval = setInterval(() => {
        this.counter += 10;
      }, 10);

    },
    stopCounter() {
      clearInterval(this.interval);
      this.resetCounter();
      this.interval = null;
    },
    pauseCounter() {
      clearInterval(this.interval);
      this.interval = null;
    },
    selectedMenu(menu) {
      this[menu.method]();
    }
  },
  computed: {
    time() {

      const ms = this.counter;

      const hours = Math.floor(ms / 3600000);
      const minutes = Math.floor((ms % 3600000) / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const milliseconds = Math.floor((ms % 1000) / 10);;

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;

    }
  }
});
</script>


<template>
  <Widget name="Stopwatch" :menu="menu" @menu="selectedMenu" :uuid="uuid">
    <div class="p-2">
      <div class="row align-items-center g-2">
        <div class="col">
          <button class="btn btn-outline-primary w-100" @click="pauseCounter()" v-if="interval">Pause</button>
          <button class="btn btn-outline-primary w-100" @click="startCounter()" v-if="!interval">Start</button>
        </div>

        <div class="col-auto text-center px-3">
          <h3 class="mb-0" v-if="!showDurationTextbox">{{ time }}</h3>
        </div>

        <div class="col">
          <button class="btn btn-outline-primary w-100" @click="stopCounter()">Stop</button>
        </div>
      </div>
    </div>
  </Widget>
</template>
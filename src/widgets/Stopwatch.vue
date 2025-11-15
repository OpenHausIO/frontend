<script>
import { defineComponent } from "vue";

import { useNotificationStore } from "@dafcoe/vue-notification";
const { setNotification } = useNotificationStore();

export default defineComponent({
  name: "Stopwatch",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      title: "",
      duration: 0,
      counter: 0,
      showTitleTextbox: false,
      showDurationTextbox: false,
      interval: null
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
    editTitle() {
      this.showTitleTextbox = true;
    },
    closeEdit() {

      this.showTitleTextbox = false;
      this.counter = 0;
      this.save();

    },
    dispatchEvent(event) {
      console.log("diuspatchEvent called in notes.vue", event);
    },
    save() {

      let data = JSON.stringify({
        title: this.title,
        counter: this.counter
      });

      window.localStorage.setItem(`widget-${this.uuid}`, data);

    },
    resetCounter() {
      this.counter = 0;
      clearInterval(this.interval);
    },
    startCounter() {

      this.closeEdit();
      this.resetCounter();

      this.interval = setInterval(() => {
          this.counter += 1;
      }, 1000);

    },
    stopCounter() {
      clearInterval(this.interval);
    }
  },
  menu: [{
    title: "Edit Title",
    method: "editTitle",
  }, {
    title: "Done editing",
    method: "closeEdit",
  }],
});
</script>


<template>
  <div class="p-2">
    <h3>
      Stopwatch: <input type="text" v-model="title" v-if="showTitleTextbox" />
      <span v-else>
        {{ title }}
      </span>
    </h3>
    <div class="w-100">
      <div class="container text-center">
        <div class="row">
          <div class="col h-100">
            <button class="btn btn-outline-primary btn-block" @click="startCounter()">Start</button>
          </div>
          <div class="col">
            <div class="container">

              <div class="row" v-if="!showDurationTextbox">
                <h3>{{ counter }}</h3>
              </div>

            </div>
          </div>
          <div class="col">
            <button class="btn btn-outline-primary btn-block" @click="stopCounter()">Stop</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
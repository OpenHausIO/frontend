<script>
import { defineComponent } from "vue";

import { useNotificationStore } from "@dafcoe/vue-notification";
const { setNotification } = useNotificationStore();

export default defineComponent({
  name: "Countdown",
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
    editCountdown() {
      this.showDurationTextbox = true;
    },
    closeEdit() {

      if (!(new RegExp(/^\d+$/).test(this.duration))) {
        setNotification({
          message: `Invalid duration. Only numbers/integers are supported. No float numbers or other charachter!`,
          type: "alert",
          showIcon: false,
          dismiss: {
            manually: true,
            automatically: false,
          },
          appearance: "dark",
        });

      }

      this.showTitleTextbox = false;
      this.showDurationTextbox = false;
      this.counter = this.duration;
      this.save();

    },
    dispatchEvent(event) {
      console.log("diuspatchEvent called in notes.vue", event);
    },
    save() {

      let data = JSON.stringify({
        title: this.title,
        duration: this.duration
      });

      window.localStorage.setItem(`widget-${this.uuid}`, data);

    },
    resetCounter() {
      this.counter = this.duration;
      clearInterval(this.interval);
    },
    startCounter() {

      this.closeEdit();

      this.interval = setInterval(() => {
        if (this.counter <= 0) {

          // NOTE: triger backend notification here?
          // if on mobile, its possible that no execution is paused
          // interatre a backend task to solve this?
          // set virbation pattern if availeb (mobile devices)

          // "Easter egg idea": Chosse a diffrente title when finished?, e.g.
          // - xyz - Liftoff!!!
          // - coundown "foo" reached 0!
          // - Your time is up!
          // - etc.

          setNotification({
            message: `Countdown "${this.title}" reached 0!`,
            type: "info",
            showIcon: false,
            dismiss: {
              manually: true,
              automatically: false,
            },
            appearance: "dark",
          });

          //alert("Countdown reached 0!");

          clearInterval(this.interval);
          this.counter = 0;

        } else {

          this.counter -= 1;

        }
      }, 1000);

    },
    pauseCounter() {

      this.closeEdit();
      clearInterval(this.interval);

    },
    increase() {
      this.duration += 1;
    },
    decrase() {
      this.duration -= 1;
    }
  },
  menu: [{
    title: "Edit Title",
    method: "editTitle",
  }, {
    title: "Edit Countdown",
    method: "editCountdown",
  }, {
    title: "Done editing",
    method: "closeEdit",
  }, {
    title: "Reset Counter",
    method: "resetCounter"
  }],
});
</script>


<template>
  <div class="p-2">
    <h3>
      Countdown: <input type="text" v-model="title" v-if="showTitleTextbox" />
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

              <div class="row" v-else>
                <div class="col h-100">
                  <button class="btn btn-outline-primary btn-block" @click="increase()">+</button>
                </div>
                <div class="col">
                  <input type="text" v-model="duration" min="0" step="1" pattern="/[0-9]*./" />
                </div>
                <div class="col">
                  <button class="btn btn-outline-primary btn-block" @click="decrase()">-</button>
                </div>
              </div>

            </div>
          </div>
          <div class="col">
            <button class="btn btn-outline-primary btn-block" @click="pauseCounter()">Pause</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
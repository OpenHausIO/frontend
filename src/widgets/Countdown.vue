<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { settingsStore } from "../store";

import { addNotification } from "../components/Notifications.vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "Countdown",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  components: {
    Widget
  },
  setup() {

    const settings = settingsStore();

    return {
      settings
    };

  },
  data() {
    return {
      data: {
        duration: 0,
      },
      counter: 0,
      showDurationTextbox: false,
      interval: null,
      menu: [{
        title: "Edit Countdown",
        method: "editCountdown",
      }, {
        title: "Done editing",
        method: "closeEdit",
      }, {
        title: "Reset Countdown",
        method: "resetCounter"
      }],
    };
  },
  computed: {
    startButton() {

      if (this.counter === this.data.duration) {
        return "Start";
      }

      if (this.interval || this.counter <= 0) {
        return "Reset";
      } else {
        return "Start";
      }

    }
  },
  methods: {
    editCountdown() {
      this.showDurationTextbox = true;
    },
    closeEdit() {

      if (!(new RegExp(/^\d+$/).test(this.data.duration))) {

        addNotification("Invalid duration. Only numbers/integers are supported. No float numbers or other charachter!", {
          type: "danger",
          dismiss: false
        });

      }

      this.showDurationTextbox = false;
      this.counter = this.data.duration;

    },
    resetCounter() {
      clearInterval(this.interval);
      this.interval = null;
      this.counter = this.data.duration;
    },
    startCounter() {

      if (this.interval || this.counter <= 0) {
        this.resetCounter();
        return;
      }

      let { title = "" } = this.$refs.widget;

      this.showDurationTextbox = false;
      this.counter -= 1;

      this.interval = setInterval(() => {

        this.counter -= 1;

        if (this.counter <= 0) {

          this.counter = 0;
          clearInterval(this.interval);

          // NOTE: triger backend notification here?
          // if on mobile, its possible that no execution is paused
          // interatre a backend task to solve this?
          // set virbation pattern if availeb (mobile devices)

          // "Easter egg idea": Chosse a diffrente title when finished?, e.g.
          // - xyz - Liftoff!!!
          // - coundown "foo" reached 0!
          // - Your time is up!
          // - etc.
          if ('vibrate' in navigator) {
            navigator.vibrate(200);
          }

          addNotification(`Countdown ${title ? `"${title}"` : ''} reached 0!`, {
            type: "primary",
            dismiss: false
          });

          /*
          if (window?.notifications && this.settings.sendSystemNotifications) {

            let msg = JSON.stringify({
              title: "<b>Countdown</b>",
              message: `${this.title ? `"${this.title}"` : 'Countdown'} reached 0!`
            });

            window.notifications.send(msg);

          }
          */

        }

      }, 1000);

    },
    pauseCounter() {
      this.showDurationTextbox = false;
      clearInterval(this.interval);
      this.interval = null;
    },
    increase() {
      this.data.duration += 1;
    },
    decrase() {
      this.data.duration -= 1;
    },
    selectedMenu(menu) {
      this[menu.method]();
    },
    loaded(data) {
      Object.assign(this.data, data);
    }
  },
});
</script>


<template>
  <Widget name="Countdown" :menu="menu" @menu="selectedMenu" :uuid="uuid" :data="data" @loaded="loaded" ref="widget">
    <div class="p-2">
      <div class="row align-items-center g-2">

        <div class="col">
          <button class="btn btn-outline-primary w-100" @click="startCounter()">{{ startButton }}</button>
        </div>

        <div class="col-auto text-center px-3" style="min-width: 6rem;">

          <h3 class="mb-0" v-if="!showDurationTextbox">{{ counter }}</h3>

          <div class="d-flex align-items-center gap-2" v-else>
            <button class="btn btn-outline-primary" @click="increase()">+</button>
            <input type="text" class="form-control text-center" v-model="data.duration" min="0" step="1"
              pattern="/[0-9]*./" style="width: 4rem" />
            <button class="btn btn-outline-primary" @click="decrase()">-</button>
          </div>

        </div>

        <div class="col">
          <button class="btn btn-outline-primary w-100" @click="pauseCounter()">Pause</button>
        </div>

      </div>
    </div>
  </Widget>
</template>
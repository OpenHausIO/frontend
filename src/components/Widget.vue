<script>
import { defineComponent } from "vue";
import { settingsStore, widgetStore } from "../store.js";

//import Weather from "../widgets/Weather.vue";
import Notes from "../widgets/Notes.vue";
import Todo from "../widgets/Todo.vue";
//import FritzBox from "../widgets/FritzBox.vue";
//import Scenes from "../widgets/Scenes.vue";
//import Alarm from "../widgets/Alarm.vue";
import Clock from "../widgets/Clock.vue";
//import Cams from "../widgets/Cams.vue";
import Empty from "../widgets/Empty.vue";
import Counter from "../widgets/Counter.vue";
import Demo from "../widgets/Demo.vue";
import Countdown from "../widgets/Countdown.vue";
import Stopwatch from "../widgets/Stopwatch.vue";
import States from "../widgets/States.vue";
import Scenes from "../widgets/Scenes.vue";

const components = {
  //Weather,
  Notes,
  Todo,
  //CustomWidget: window["CustomWidget"],
  //FritzBox,
  //Scenes,
  //Alarm,
  Clock,
  //Cams,
  Empty,
  Counter,
  Countdown,
  Stopwatch,
  States,
  Scenes
};

// make demo Widget only available when we are on spefici domain
if (window.location.hostname === "demo.open-haus.io") {
  components.Demo = Demo;
}

export default defineComponent({
  setup() {

    const settings = settingsStore();
    const store = widgetStore();

    return {
      settings,
      store
    };

  },
  props: {
    unlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
  },
  components,
  data() {
    return {
      components,
      childAction: "",
    };
  },
  methods: {
    remove(widget) {
      this.store.remove(widget);
    },
    dispatchEvent(entry) {
      let widget = this.$refs.widget;
      if (entry.method && widget[entry.method]) {
        widget[entry.method]();
      } else {
        widget.dispatchEvent(entry.event);
      }
    },
  },
  errorCaptured(err) {
    console.log("Error captured", err);
  },
});
</script>


<template>
  <div class="h-100 w-100 d-block widget">
    <div class="btn-group d-block">
      <i class="fa-solid fa-ellipsis-vertical float-end text-center mt-1"
        style="width: 30px; height: 30px; cursor: pointer !important; color: gray;" data-bs-toggle="dropdown"
        aria-expanded="false" v-if="settings.editDashboardWidgets || components[name].menu.length > 0"></i>
      <ul class="dropdown-menu dropdown-menu-dark">
        <li v-bind:key="index" v-for="(entry, index) in components[name].menu">
          <button class="dropdown-item d-flex gap-2 align-items-center" @click="dispatchEvent(entry)">
            {{ entry.title }}
          </button>
        </li>
        <li v-if="components[name].menu.length > 0 && settings.editDashboardWidgets">
          <hr class="dropdown-divider" />
        </li>
        <li v-if="settings.editDashboardWidgets">
          <button class="dropdown-item d-flex gap-2 align-items-center" @click="remove($refs.widget)">
            Remove
          </button>
        </li>
      </ul>
    </div>

    <component v-bind:is="name" :uuid="uuid" ref="widget" />
  </div>
</template>

<style scope>
i,
ul.dropdown-menu {
  z-index: 9999999 !important;
}

.widget {
  overflow-y: scroll;
}

/*
Draff/fix/implementation of #93
ul.dropdown-menu-dark {
  background-color: rgba(var(--bs-dark-rgb), var(--bs-bg-opacity));
}
*/
</style>
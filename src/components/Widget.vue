<script setup>
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
import { defineComponent } from "vue";

import { widgetStore } from "../store.js";
const store = widgetStore();

//import Weather from "../widgets/Weather.vue";
import Notes from "../widgets/Notes.vue";
import Todo from "../widgets/Todo.vue";
//import FritzBox from "../widgets/FritzBox.vue";
//import Scenes from "../widgets/Scenes.vue";
//import Alarm from "../widgets/Alarm.vue";
import Clock from "../widgets/Clock.vue";
//import Cams from "../widgets/Cams.vue";
import Empty from "../widgets/Empty.vue";

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
};

export default defineComponent({
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
      store.remove(widget);
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
    console.lo("Error captured", err);
  },
});
</script>


<template>
  <div class="h-100 w-100 d-block">
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

    <component class="h-100 w-100 d-block" v-bind:is="name" :uuid="uuid" :action="childAction" ref="widget" />
  </div>
</template>

<style scope>
i,
ul.dropdown-menu {
  z-index: 9999999 !important;
}

/*
Draff/fix/implementation of #93
ul.dropdown-menu-dark {
  background-color: rgba(var(--bs-dark-rgb), var(--bs-bg-opacity));
}
*/
</style>
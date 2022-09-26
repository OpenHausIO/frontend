<script>
import { defineComponent } from "vue";

import Weather from "../widgets/Weather.vue";
import Notes from "../widgets/Notes.vue";
import Todo from "../widgets/Todo.vue";
import FritzBox from "../widgets/FritzBox.vue";
import Scenes from "../widgets/Scenes.vue";
import Alarm from "../widgets/Alarm.vue";
import Clock from "../widgets/Clock.vue";
import Cams from "../widgets/Cams.vue";
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
    remove() {
      let widgets = JSON.parse(window.localStorage.getItem("widgets")) || [];

      console.log("Widgets size", widgets.length);

      let target = widgets.find((widget) => {
        return this.uuid === widget.uuid;
      });

      let index = widgets.indexOf(target);
      widgets.splice(index, 1);

      console.log("Widgets size", widgets.length);

      window.localStorage.setItem("widgets", JSON.stringify(widgets));
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
});
</script>


<template>
  <div class="h-100 w-100 d-block">
    <div class="btn-group d-block">
      <i
        class="fa-solid fa-ellipsis-vertical float-end text-center mt-1"
        style="
          width: 30px;
          height: 30px;
          cursor: pointer !important;
          color: gray;
        "
        v-if="unlocked"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      ></i>
      <ul class="dropdown-menu dropdown-menu-dark">
        <li v-bind:key="index" v-for="(entry, index) in components[name].menu">
          <button
            class="dropdown-item d-flex gap-2 align-items-center"
            @click="
              /*$window.alert('Pass click somehow to child:' + entry.title)*/ dispatchEvent(
                entry
              )
            "
          >
            {{ entry.title }}
          </button>
        </li>
        <li v-if="components[name].menu.length > 0">
          <hr class="dropdown-divider" />
        </li>
        <li>
          <button
            class="dropdown-item d-flex gap-2 align-items-center"
            @click="remove()"
          >
            Remove
          </button>
        </li>
      </ul>
    </div>

    <component
      class="h-100 w-100 d-block"
      v-bind:is="name"
      :uuid="uuid"
      :action="childAction"
      ref="widget"
    />
  </div>
</template>

<style scope>
i,
ul.dropdown-menu {
  z-index: 9999999 !important;
}
</style>
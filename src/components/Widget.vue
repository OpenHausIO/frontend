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

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
  },
  components: {
    Weather,
    Notes,
    Todo,
    //CustomWidget: window["CustomWidget"],
    FritzBox,
    Scenes,
    Alarm,
    Clock,
    Cams,
  },
  data() {
    return {};
  },
});
</script>


<template>
  <component class="h-100 w-100 d-block" v-bind:is="name" :uuid="uuid" />
</template>

<style scope>
</style>
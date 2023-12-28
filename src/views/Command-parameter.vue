<script setup>
import CommandParameter from "@/components/CommandParameter.vue";
import { useRoute } from "vue-router";
import { debounce } from "../helper";
</script>

<script>
import { mapActions } from "pinia";
import { itemStore } from "../store.js";
const items = itemStore();

export default {
  components: {
    CommandParameter
  },
  data() {
    return {
      data: {},
      endpoint: null,
    };
  },
  mounted() {
    let $route = useRoute();

    let endpoint = Array.from(items.endpoints).find((item) => {
      return item._id === $route.params._id;
    });

    if (!endpoint) {
      console.error("No endpoint found for _id", $route.params._id);
      return;
    }

    let command = endpoint.commands.find((obj) => {
      return $route.params._command === obj._id;
    });

    if (!command) {
      console.error("No command found for _id", $route.params._command);
      return;
    }

    command.params = command.params.map((param) => {
      param.value = param.value || param.min || 0;
      return param;
    });

    this.data = command;
    this.endpoint = endpoint;
  },
  methods: {
    ...mapActions(itemStore, ["getRoomNameById", "getDeviceNameById"]),
    debounce: debounce((param) => {
      console.log(
        "Trigger command",
        param,
        this.data.name,
        this.data.params,
        useRoute()
      );

      // NOTE:
      // cant use `let $route = useRoute(); here`
      // it allways returns undefine, thats the reason
      // for this hacky "this.endpoint" thing

      request(`/api/endpoints/${this.endpoint._id}/commands/${this.data._id}`, {
        method: "POST",
        body: this.data,
      }, (err, body) => {
        console.log("Trigger response", err, body);
      });

    }, 500),
    trigger(param) {
      console.log("trigger called", param);
      this.debounce(param);
    },
  },
};
</script>

<template>
  <div class="container-fluid">

    <!-- HEADER -->
    <div class="row py-4" style="border-top: 1px solid #000; border-bottom: 1px solid #000">

      <!-- LEFT -->
      <div class="col">
        <div class="d-inline-flex">
          <div class="me-2 pt-1">
            <i :class="data.icon || 'fa-solid fa-circle-question'" class="fa-3x"></i>
          </div>
          <div class="">
            <h3 class="mb-0">
              {{ data.name }}
              <!--<sup class="text-secondary">•</sup>-->
            </h3>
            <span class="text-secondary fw-light d-block">
              {{ endpoint?.name || "" }}
            </span>
          </div>
        </div>
      </div>
      <!-- LEFT -->

    </div>
    <!-- HEADER -->


    <!-- COMMAND PARAMETERS -->
    <div class="row display-flex text-center" v-bind:key="index" v-for="(param, index) in data.params">
      <div class="p-0 col-6 col-md-3 col-xl-2">

        <CommandParameter :param="param" @changed="trigger(data)"></CommandParameter>

      </div>
    </div>
    <!-- COMMAND PARAMETERS -->

    <!--
    <div class="row display-flex text-center" v-bind:key="index" v-for="(param, index) in data.params">
      <div class="p-0 col-6 col-md-3 col-xl-2" style="text-align: left;">
        <Tile style="background: transparent; border: 1px solid rgb(0, 0, 0)" @click="trigger(data)">
          <div v-if="param.type === 'number'">

            {{ param.name }}

            <input type="range" :class="param.classes" v-model="param.value" @change="trigger(data)" :min="param.min"
              :max="param.max" :style="{
                '--pointerBgColor': param.value
              }">

          </div>
          <div v-else-if="param.type === 'string'">


            <div>{{ param.name || param.value }} </div>


          </div>
          <div v-else-if="param.type === 'boolean'">

            {{ param.name }}

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" :id="'booleanCheckboxParameter' + param._id"
                v-model="param.value" />
              <label class="form-check-label small" :for="'booleanCheckboxParameter' + param._id">
                {{ param.name }}
              </label>
            </div>

          </div>
          <div v-else>
            Unsupported type "{{ param.type }}"
          </div>

        </Tile>
      </div>
    </div>
    -->


  </div>
</template>


<style scoped>
/*
https://codepen.io/stoumann/full/QWKdKxJ
https://codepen.io/adrianparr/pen/MYmrdJ
https://codepen.io/stoumann/pen/QWKdKxJ
*/
input[type="range"].hsv-fader {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  width: 100%;
  height: 6px;
  background-image: linear-gradient(to right, red, #ff8000, #ff0, #80ff00, lime, #00ff80, cyan, #007fff, blue, #7f00ff, #f0f, #ff0080, red);
}

input[type="range"].hsv-fader::-webkit-slider-thumb,
input[type="range"].hsv-fader::-moz-range-thumb {
  background-color: hsl(var(--pointerBgColor), 100%, 50%);
  /*rgba(0, 0, 0, 0.5);*/
  border-color: black;
  border-width: 2px;
  border-radius: 100%;
  /*-webkit-box-shadow: 0px 0px 4px 0px hsl(var(--pointerBgColor), 100%, 50%);*/
  box-shadow: 0px 0px 6px 0px hsl(var(--pointerBgColor), 100%, 30%);
}

input[type="range"].brightness-fader {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  width: 100%;
  height: 6px;
  background-image: linear-gradient(to right, #000, #fff);
}

input[type="range"].brightness-fader::-webkit-slider-thumb,
input[type="range"].brightness-fader::-moz-range-thumb {
  background-color: #fff;
  filter: brightness(calc(var(--pointerBgColor) * 0.01));
  border-color: black;
  border-width: 2px;
  border-radius: 100%;
  /*-webkit-box-shadow: 0px 0px 4px 0px hsl(var(--pointerBgColor), 100%, 50%);*/
  box-shadow: 0px 0px 6px 0px hsl(var(--pointerBgColor), 100%, 30%);
}
</style>
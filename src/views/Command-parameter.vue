<script setup>
import { useRoute } from "vue-router";
</script>

<script>
export default {
  data() {
    return {
      data: {},
      endpoint: null,
    };
  },
  mounted() {
    let $route = useRoute();

    let endpoint = Array.from(window.store.endpoints).find((item) => {
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
    debounce: window.debounce(function (param) {
      console.log(
        "Trigger command",
        param,
        this.data.name,
        this.data.params,
        useRoute()
      );

      window.request(
        `/api/endpoints/${this.endpoint._id}/commands/${this.data._id}`,
        {
          method: "POST",
          body: this.data,
        },
        (err, body) => {
          console.log("Trigger response", err, body);
        }
      );
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
    <div class="row" v-bind:key="index" v-for="(param, index) in data.params">
      <div class="col">
        <div v-if="param.min && param.max">
          <h3>{{ data.name }}</h3>
          <input
            type="range"
            class="form-range"
            v-bind:min="param.min"
            v-bind:max="param.max"
            v-model="param.value"
            v-on:input="trigger(param)"
          />
          {{ param }}
        </div>
        <div v-else>
          Single
          {{ data.name }}: {{ param }} {{ index }}

          <button class="btn btn-primary" @click="trigger(param)">
            {{ param.value }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

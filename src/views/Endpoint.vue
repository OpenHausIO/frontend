<script setup>
import Tile from "@/components/Tile.vue";
import { useRoute, RouterLink } from "vue-router";
//import { store } from "@/store";
import { alert, request } from "@/helper";
</script>

<script>
import { mapActions } from "pinia";
import { itemStore } from "../store.js";
const store = itemStore();

export default {
  components: {
    Tile,
    RouterLink,
  },
  data() {
    return {
      data: {},
    };
  },
  mounted() {
    let $route = useRoute();

    this.data = Array.from(store.endpoints).find((item) => {
      return item._id === $route.params._id;
    });
  },
  methods: {
    //getRoomNameById,
    ...mapActions(itemStore, ["getRoomNameById", "getDeviceNameById"]),
    alert,
    trigger(_id, event) {
      let command = this.data.commands.find((obj) => {
        return obj._id === _id;
      });

      if (!command) {
        console.warn("Could not find command with _id: ", _id);
        return;
      }

      // does not work
      //event.target.classList.toggle("animate");
      //event.target.classList.toggle("animate__fadeIn");

      let url = `/api/endpoints/${this.data._id}/commands/${_id}`;

      request(
        url,
        {
          method: "POST",
        },
        (err, result) => {
          console.log(err, result);
        }
      );
    },
    repeat(cmd) {
      this.trigger(cmd._id);
    },
  },
  computed: {
    commands() {
      return this.data.commands?.length || 0;
    },
    states() {
      return this.data.states?.length || 0;
    },
    /*
    scenes() {
      return Math.round(Math.random() * 10);
    },*/
  },
};
</script>

<template>
  <div class="container-fluid">
    <!-- HEADER -->
    <div
      class="row py-4"
      style="border-top: 1px solid #000; border-bottom: 1px solid #000"
    >
      <!-- LEFT -->
      <div class="col">
        <div class="d-inline-flex">
          <div class="me-2 pt-1">
            <i
              :class="data.icon || 'fa-solid fa-circle-question'"
              class="fa-3x"
            ></i>
          </div>
          <div class="">
            <h3 class="mb-0">
              {{ data.name }}
              <!--<sup class="text-secondary">•</sup>-->
            </h3>
            <span class="text-secondary fw-light d-block">
              {{ getRoomNameById(data.room) }}
            </span>
          </div>
        </div>
      </div>
      <!-- LEFT -->
      <!-- RIGHT -->
      <div class="col text-end" style="font-size: 14px">
        <span class="text-secondary fw-light d-block">
          <!--Commands: {{ Math.round(Math.random() * 10) }}-->
          Commands: {{ commands }}
        </span>
        <span class="text-secondary fw-light d-block">
          States: {{ states }}
        </span>
        <!--
        <span class="text-secondary fw-light d-block">
          Scenes: {{ scenes }}
        </span>
        -->
      </div>
      <!-- RIGHT -->
    </div>
    <!-- HEADER -->
    <!-- COMMANDS/STATES/SCENES -->
    <div
      class="row display-flex text-center"
      style="height: calc(100% - 109px)"
    >
      <!-- COMMANDS -->
      <div
        class="p-0 col-6 col-md-3 col-xl-2"
        v-bind:key="command._id"
        v-for="command in data.commands"
      >
        <RouterLink
          custom
          :to="{
            name: '/endpoints/:_id/commands/:_command',
            params: {
              _id: $route.params._id,
              _command: command._id,
            },
          }"
          v-slot="{ href, navigate }"
          v-if="command.params?.length > 0"
        >
          <Tile
            style="background: transparent; border: 1px solid rgb(0, 0, 0)"
            :href="href"
            @click="navigate"
          >
            <template #title>
              <i :class="command.icon || 'fa-regular fa-circle-question'"></i>
            </template>
            {{ command.name }}
          </Tile>
        </RouterLink>
        <Tile
          v-else
          style="background: transparent; border: 1px solid rgb(0, 0, 0)"
          @click="trigger(command._id, $event)"
          v-repeat="{ handler: repeat, interval: 300, command }"
        >
          <template #title>
            <i :class="command.icon"></i>
          </template>
          {{ command.name }}
        </Tile>
      </div>
      <!-- COMMANDS -->
      <!-- STATES -->
      <div
        class="p-0 col-6 col-md-3 col-xl-2"
        v-bind:key="state._id"
        v-for="state in data.states"
      >
        <Tile style="background: transparent; border: 1px solid rgb(0, 0, 0)">
          <div>{{ state.name }}</div>
          <i>{{ state.value ? state.value : "na" }}</i>
        </Tile>
      </div>
      <!-- STATES -->
    </div>
    <!-- COMMANDS/STATES/SCENES -->
  </div>
</template>

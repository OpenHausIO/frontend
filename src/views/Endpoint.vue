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
};
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h3>
          {{ data.name }}
          <span class="text-secondary fw-light"
            >({{ getRoomNameById(data.room) }})</span
          >
        </h3>
      </div>

      <!-- COMMANDS -->
      <div
        class="col-2 mb-4"
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
          <Tile class="bg-dark border-secondary" :href="href" @click="navigate">
            <template #title>
              <i :class="command.icon"></i>
            </template>
            {{ command.name }}
          </Tile>
        </RouterLink>
        <Tile
          v-else
          class="bg-dark border-secondary"
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
        class="col-2 mb-4"
        v-bind:key="state._id"
        v-for="state in data.states"
      >
        <Tile class="bg-dark border-secondary">
          <div>{{ state.name }}</div>
          <i>{{ state.value ? state.value : "na" }}</i>
        </Tile>
      </div>
      <!-- STATES -->
    </div>
  </div>
</template>

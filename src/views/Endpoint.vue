<script setup>
import Tile from "@/components/Tile.vue";
import { useRoute, RouterLink } from "vue-router";
</script>

<script>
export default {
  components: { Tile, RouterLink },
  data() {
    return {
      data: {},
    };
  },
  mounted() {
    let $route = useRoute();

    this.data = Array.from(window.store.endpoints).find((item) => {
      return item._id === $route.params._id;
    });
  },
  methods: {
    getRoomNameById(_id) {
      let room = Array.from(window.store.rooms).find((obj) => {
        return obj._id === _id;
      });

      if (!room) {
        return "Raum: nicht gesetzt";
      }

      return room.name;
    },
    popup(...args) {
      window.alert.apply(window, args);
    },
    trigger(_id) {
      let command = this.data.commands.find((obj) => {
        return obj._id === _id;
      });

      if (!command) {
        console.warn("Could not find command with _id: ", _id);
        return;
      }

      let url = `/api/endpoints/${this.data._id}/commands/${_id}`;

      window.request(
        url,
        {
          method: "POST",
        },
        (err, result) => {
          console.log(err, result);
        }
      );
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
          @click="trigger(command._id)"
        >
          <template #title>
            <i :class="command.icon"></i>
          </template>
          {{ command.name }}
        </Tile>
      </div>
    </div>
  </div>
</template>

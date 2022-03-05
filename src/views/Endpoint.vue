<script setup>
import Tile from "@/components/Tile.vue";
import { useRoute } from "vue-router";
</script>

<script>
export default {
  components: { Tile },
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
        <Tile class="bg-dark border-secondary">
          <template #title>
            <i :class="command.icon"></i>
          </template>
          {{ command.name }}
        </Tile>
      </div>
    </div>
  </div>
</template>

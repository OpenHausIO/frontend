<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "../components/Collapsable.vue";
import { useRoute } from "vue-router";
import { store } from "../store";
</script>

<script>
export default {
  components: { Tile, Collapsable },
  data() {
    return {
      data: {},
      endpoints: [],
    };
  },
  mounted() {
    let $route = useRoute();

    this.data = Array.from(store.rooms).find((item) => {
      return item._id === $route.params._id;
    });

    let endpoints = Array.from(store.endpoints).filter((obj) => {
      return obj.room === this.data._id;
    });

    console.log("Endpoints:", endpoints);

    this.endpoints.push(...endpoints);
  },
  methods: {
    getRoomNameById(_id) {
      let room = Array.from(store.rooms).find((obj) => {
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
    <div class="row hide">
      <div>
        <b>sngle Room: {{ data }}, Endpoints: {{ endpoints }}</b>
        <hr />
        {{ $route.params._id }}
      </div>
    </div>
    <div class="row" v-if="endpoints.length > 0">
      <RouterLink
        v-bind:key="item._id"
        v-for="item in endpoints"
        custom
        :to="{
          name: '/endpoints/:_id',
          params: {
            _id: item._id,
          },
        }"
        v-slot="{ href, navigate }"
      >
        <div class="col-2 mb-4">
          <Tile :href="href" @click="navigate" class="bg-dark border-secondary">
            <template #icon>
              <i class="fa-2xl" :class="item.icon"></i>
            </template>
            <template #title>{{ item.name }} </template>
            <span class="text-secondary fw-light">
              ({{ getRoomNameById(item.room) }})
            </span>
          </Tile>
        </div>
      </RouterLink>
    </div>
    <div class="row" v-else>
      <div class="col-12">
        <h1>No Endpoints assigned</h1>
      </div>
    </div>
  </div>
</template>

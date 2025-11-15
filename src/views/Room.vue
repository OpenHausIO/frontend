<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "../components/Collapsable.vue";
import { useRoute } from "vue-router";
//import { store } from "../store";
</script>

<script>
import { isNumber } from "../helper.js";
import { mapActions } from "pinia";
import { itemStore } from "../store.js";
const store = itemStore();

export default {
  components: {
    Tile,
    Collapsable,
  },
  data() {
    return {
      data: {},
      endpoints: [],
      scenes: [], // fake, fill with real scenes if implemented!
    };
  },
  mounted() {
    let $route = useRoute();

    // NOTE: This should?! be a computed property?
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
    ...mapActions(itemStore, ["getRoomNameById"]),
    /*
    getRoomNameById(_id) {
      let room = Array.from(store.rooms).find((obj) => {
        return obj._id === _id;
      });

      if (!room) {
        return "Raum: nicht gesetzt";
      }

      return room.name;
    },
    */
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
            </h3>
            <span class="text-secondary fw-light d-block">
              {{ isNumber(data?.number) ? "Number: " + data.number : "" }}
              <span v-if="isNumber(data?.number) && isNumber(data?.floor)">
                /
              </span>
              {{ isNumber(data?.floor) ? "Floor: " + data.floor : "" }}
            </span>
          </div>
        </div>
      </div>
      <!-- LEFT -->
      <!-- SCENES -->
      <div class="col">
        <div class="d-inline-flex">
          <button
            class="btn btn-outline-primary d-inline-block"
            style="height: 58px; margin-right: 5px"
            v-for="(scene, index) in scenes"
            v-bind:key="index"
          >
            Scene #{{ index + 1 }}
          </button>
        </div>
      </div>
      <!-- SCENES -->
    </div>
    <!-- HEADER -->
    <!-- ITEM -->
    <div
      class="row display-flex text-center"
      v-if="endpoints.length > 0"
      style="height: calc(100% - 109px)"
    >
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
        <div class="p-0 col-6 col-md-3 col-xl-2">
          <Tile
            :href="href"
            @click="navigate"
            style="background: transparent; border: 1px solid #000"
          >
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
    <!-- ITEM -->
    <div class="row" v-else>
      <div class="col-12">
        <h6>Empty here, assign some endpoints to this room.</h6>
      </div>
    </div>
  </div>
</template>

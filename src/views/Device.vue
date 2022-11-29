<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "../components/Collapsable.vue";
import { useRoute } from "vue-router";
import router from "@/router";
//import { store } from "../store";
</script>

<script>
//import { mapActions } from "pinia";
import { itemStore } from "../store.js";
const store = itemStore();

export default {
  components: {
    Collapsable,
    Tile,
  },
  data() {
    return {
      data: {},
      endpoints: [],
    };
  },
  mounted() {
    let $route = useRoute();

    //NOTE switch to computed property?!
    this.data = Array.from(store.devices).find((item) => {
      return item._id === $route.params._id;
    });

    let endpoints = Array.from(store.endpoints).filter((obj) => {
      return obj.device === this.data._id;
    });

    // skip endpoint selection when only one is provide by the device
    // TODO Make this optional in settings
    if (endpoints.length === 1) {
      router.replace({
        name: "/endpoints/:_id",
        params: {
          _id: endpoints[0]._id,
        },
      });
      return;
    }

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
    <div class="h-100">
      <!-- DONT GROUP -->
      <div class="row h-100 display-flex text-center">
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
      <!-- DONT GROUP -->
    </div>
  </div>
</template>

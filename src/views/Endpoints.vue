<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "../components/Collapsable.vue";
import { store } from "../store";
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
import { inject } from "vue";
export default {
  components: {
    Collapsable,
    Tile,
  },
  data() {
    return {
      items: store.endpoints,
      rooms: {},
    };
  },
  computed: {
    /*
    settings() {
      return inject("settings");
    },
    */
  },
  mounted() {
    this.rooms = Array.from(this.items).reduce((obj, item) => {
      obj[item.room] = obj[item.room] || [];
      obj[item.room].push(item);
      return obj;
    }, {});
  },
  methods: {
    getRoomNameById(_id) {
      let room = Array.from(store.rooms).find((obj) => {
        return obj._id === _id;
      });

      if (!room) {
        return "undefined";
      }

      return room.name;
    },
  },
};
</script>

<template>
  <div class="container-fluid">
    <div v-show="settings.groupEndpointItems">
      <!-- COLLAPSABLE FLOOR -->
      <div class="row" v-bind:key="index" v-for="(endpoints, index) in rooms">
        <Collapsable>
          <template #title>Room: {{ getRoomNameById(index) }}</template>
          <RouterLink
            v-bind:key="item._id || Date.now()"
            v-for="item in endpoints"
            custom
            :to="{
              name: '/endpoints/:_id',
              params: {
                _id: item._id || Date.now(),
              },
            }"
            v-slot="{ href, navigate }"
          >
            <div class="col-2 mb-4">
              <Tile
                :href="href"
                @click="navigate"
                class="bg-dark border-secondary"
              >
                <template #icon>
                  <i
                    class="fa-2xl"
                    :class="item.icon || 'fa-solid fa-question'"
                  ></i>
                </template>
                <template #title>{{ item.name }} </template>
                <!--{{ item.name }} -> slot content -->
              </Tile>
            </div>
          </RouterLink>
        </Collapsable>
      </div>
      <!-- COLLAPSABLE FLOOR -->
    </div>
    <div class="h-100" v-show="!settings.groupEndpointItems">
      <!-- DONT GROUP -->
      <div class="row h-100 display-flex text-center">
        <RouterLink
          v-bind:key="item._id"
          v-for="item in items"
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
                <i
                  class="fa-2xl"
                  :class="item.icon || 'fa-solid fa-question'"
                ></i>
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

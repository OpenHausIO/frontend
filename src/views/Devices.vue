<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "@/components/Collapsable.vue";
//import { store } from "../store";
//import { getRoomNameById, getDeviceNameById } from "@/helper";
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
import { mapActions } from "pinia";
import { itemStore } from "../store.js";
const store = itemStore();

export default {
  components: {
    Collapsable,
    Tile,
  },
  data() {
    return {
      //items: store.devices,
    };
  },
  computed: {
    items() {
      return store.devices.filter(({ enabled }, index) => {
        console.log("Computed devices filter", enabled, index);
        return enabled;
      });
    },
  },
  mounted() {
    /*
    this.devices = Array.from(this.items.devices).reduce((obj, item) => {
      obj[item.device] = obj[item.device] || [];
      obj[item.device].push(item);
      return obj;
    }, {});
    */
  } /*
  computed: {
    items() {
      return store.devices.filter((item) => {
        return item.enabled;
      });
    },
  },*/,
  methods: {
    //getDeviceNameById,
    //getRoomNameById,
    ...mapActions(itemStore, ["getRoomNameById", "getDeviceNameById"]),
  },
};
</script>

<template>
  <div class="container-fluid">
    <!-- DONT GROUP -->
    <div class="row h-100 display-flex text-center">
      <RouterLink
        v-bind:key="item._id"
        v-for="item in items"
        custom
        :to="{
          name: '/devices/:_id',
          params: {
            _id: item._id,
          },
        }"
        v-slot="{ href, navigate }"
      >
        <div class="p-0 col-6 col-md-4 col-xl-2">
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
</template>

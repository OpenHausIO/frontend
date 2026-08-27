<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "@/components/Collapsable.vue";
import ResizableGrid from "@/components/ResizableGrid.vue";
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
    ResizableGrid,
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
        //console.log("Computed devices filter", enabled, index);
        return enabled;
      });
    },
    rooms() {
      return Array.from(this.items).reduce((obj, item) => {
        obj[item.room] = obj[item.room] || [];
        obj[item.room].push(item);
        return obj;
      }, {});
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
    getRoomById(_id) {
      return Array.from(store.rooms).find((obj) => {
        return obj._id === _id;
      });
    }
  },
};
</script>

<template>
  <div class="container-fluid">
    <div v-show="settings.groupDeviceItems">
      <!-- COLLAPSABLE FLOOR -->
      <div class="row" v-bind:key="roomId" v-for="(devices, roomId) in rooms">
        <Collapsable :name="`endpoints-${roomId}`">

          <template #title>
            <div class="me-2 pt-1">
              <i :class="getRoomById(roomId)?.icon || 'fa-solid fa-circle-question'
                " class="fa-3x"></i>
            </div>
            <div class="">
              <h3 class="mb-0">
                {{ getRoomById(roomId)?.name || "Undefined" }}
              </h3>
              <span class="text-secondary fw-light d-block">
                Devices: {{ devices.length }}
              </span>
            </div>
          </template>

          <ResizableGrid :items="devices" v-slot="{ item }">
            <RouterLink custom :to="{
              name: '/devices/:_id',
              params: {
                _id: item._id,
              },
            }" v-slot="{ href, navigate }">

              <Tile :href="href" @click="navigate" style="background: transparent; border: 1px solid rgb(0, 0, 0)">
                <template #icon>
                  <i class="fa-2xl" :class="item.icon || 'fa-solid fa-question'"></i>
                </template>
                <template #title>{{ item.name }} </template>
                <!--{{ item.name }} -> slot content -->
              </Tile>

            </RouterLink>
          </ResizableGrid>

          <!--
          <RouterLink v-bind:key="item._id || Date.now()" v-for="item in endpoints" custom :to="{
            name: '/endpoints/:_id',
            params: {
              _id: item._id || Date.now(),
            },
          }" v-slot="{ href, navigate }">
            <div class="col-6 col-md-3 col-xl-2" :style="{ 'padding': `${settings.layout.gap}px` }">
              <Tile :href="href" @click="navigate" style="background: transparent; border: 1px solid rgb(0, 0, 0)">
                <template #icon>
                  <i class="fa-2xl" :class="item.icon || 'fa-solid fa-question'"></i>
                </template>
                <template #title>{{ item.name }} </template>
                <!--{{ item.name }} -> slot content --
              </Tile>
            </div>
          </RouterLink>
          -->

        </Collapsable>
      </div>
      <!-- COLLAPSABLE FLOOR -->
    </div>
    <!-- DONT GROUP -->
    <div class="row display-flex text-center h-100" v-show="!settings.groupDeviceItems">
      <ResizableGrid :items="items" v-slot="{ item }">

        <RouterLink custom :to="{
          name: '/devices/:_id',
          params: {
            _id: item._id,
          },
        }" v-slot="{ href, navigate }">

          <Tile :href="href" @click="navigate">
            <template #icon>
              <i class="fa-2xl" :class="item.icon || 'fa-solid fa-question'"></i>
            </template>
            <template #title>{{ item.name }} </template>
            <span v-if="item.room" class="text-secondary fw-light"
              style="position: absolute; bottom: 15px; left: 0; right: 0;">
              {{ getRoomNameById(item.room) }}
            </span>
          </Tile>

        </RouterLink>

      </ResizableGrid>
    </div>
    <!-- DONT GROUP -->
  </div>
</template>

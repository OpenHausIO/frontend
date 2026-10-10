<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "../components/Collapsable.vue";
import ResizableGrid from "../components/ResizableGrid.vue";
//import { store } from "../store";
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
import { itemStore } from "../store.js";
const store = itemStore();

export default {
  components: {
    Collapsable,
    Tile,
    ResizableGrid
  },
  data() {
    return {
      //items: store.endpoints,
      //rooms: {},
    };
  },
  computed: {
    items() {
      return store.endpoints.filter(({ enabled }, index) => {
        //console.log("Computed endpoint filter", enabled, index);
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
  /*
  mounted() {
    this.rooms = Array.from(this.items).reduce((obj, item) => {
      obj[item.room] = obj[item.room] || [];
      obj[item.room].push(item);
      return obj;
    }, {});
  },
  */
  methods: {
    getRoomById(_id) {
      return Array.from(store.rooms).find((obj) => {
        return obj._id === _id;
      });
    }
  }
};
</script>

<template>
  <div class="container-fluid">
    <div v-show="settings.groupEndpointItems">
      <!-- COLLAPSABLE FLOOR -->
      <div class="row" v-bind:key="roomId" v-for="(endpoints, roomId) in rooms">
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
                Endpoints: {{ endpoints.length }}
              </span>
            </div>
          </template>

          <ResizableGrid :items="endpoints" v-slot="{ item }">
            <RouterLink custom :to="{
              name: '/endpoints/:_id',
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
    <div class="h-100" v-show="!settings.groupEndpointItems">

      <!-- DONT GROUP -->
      <div class="row h-100 display-flex text-center">
        <ResizableGrid :items="items" v-slot="{ item }">
          <RouterLink custom :to="{
            name: '/endpoints/:_id',
            params: {
              _id: item._id,
            },
          }" v-slot="{ href, navigate }">

            <Tile :href="href" @click="navigate" style="background: transparent; border: 1px solid #000">
              <template #icon>
                <i class="fa-2xl" :class="item.icon || 'fa-solid fa-question'"></i>
              </template>
              <template #title>{{ item.name }} </template>
              <span v-if="item.room" class="text-secondary fw-light"
                style="position: absolute; bottom: 15px; left: 0; right: 0;">
                {{ getRoomById(item.room)?.name || "Undefined" }}
              </span>
            </Tile>

          </RouterLink>
        </ResizableGrid>
      </div>
      <!-- DONT GROUP -->

    </div>
  </div>
</template>
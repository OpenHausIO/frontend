<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "@/components/Collapsable.vue";
import ResizableGrid from "../components/ResizableGrid.vue";
//import { store } from "../store";
import { groupObjByKey, isNumber } from "@/helper";
import { settingsStore } from "../store.js";
const settings = settingsStore();

//const items = itemStore();
//const rooms = items.rooms;
//console.log("Item store", items.rooms);
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
      //items: store.rooms,
      floors: {},
      groupItems: false,
      hideButtonGrouping: false,
    };
  },
  computed: {
    items() {
      return store.rooms;
      return [
        //...store.rooms,
        //...store.rooms.slice(5),
        //...store.rooms.slice(1),
        //...store.rooms,
        ///...store.rooms,
        //...store.rooms,
        //...store.rooms,
      ];
    },
  },
  watch: {
    items: {
      handler() {
        console.log("Items.length changed, Force regroupoing!");

        this.floors = groupObjByKey(this.items, "floor");

        if (Object.keys(this.floors).length === 1) {
          this.groupItems = false;
          //this.hideButtonGrouping = true;
        }
      },
      deep: true,
    },
  },
  mounted() {
    // /setInterval(() => {
    console.log("Mount groupoing!");

    this.floors = groupObjByKey(this.items, "floor");

    if (Object.keys(this.floors).length === 1) {
      this.groupItems = false;
      //this.hideButtonGrouping = true;
    }
    //}, 3000);
  },
};
</script>
<template>
  <div class="container-fluid">
    <div v-if="settings.groupRoomItems">
      <!-- COLLAPSABLE FLOOR -->
      <div class="row" v-bind:key="index" v-for="(rooms, floor, index) in floors">
        <Collapsable :name="`rooms.floor-${floor}`">

          <template #title>
            <div class="me-2 pt-1">
              <i class="fa-sharp fa-solid fa-layer-group fa-3x"></i>
            </div>
            <div class="">
              <h3 class="mb-0">Floor {{ floor }}</h3>
              <span class="text-secondary fw-light d-block">
                Rooms: {{ rooms.length }}
              </span>
            </div>
          </template>

          <ResizableGrid :items="rooms" v-slot="{ item }">

            <RouterLink custom :to="{
              name: '/rooms/:_id',
              params: {
                _id: item._id,
              },
            }" v-slot="{ href, navigate }">

              <!--
            <div class="col-6 col-md-3 col-xl-2" :style="{ 'padding': `${settings.layout.gap}px` }">
              <Tile :href="href" @click="navigate" style="background: transparent; border: 1px solid rgb(0, 0, 0)">
                <template #icon>
                  <i class="fa-2xl" :class="item.icon || 'fa-solid fa-question'"></i>
                </template>
                <template #title>{{ item.name }} </template>
                <!--{{ item.name }} -> slot content --
              </Tile>
            </div>
          -->


              <Tile :href="href" @click="navigate">
                <template #icon>
                  <i class="fa-2xl" :class="item.icon || 'fa-solid fa-question'"></i>
                </template>
                <template #title>{{ item.name }} </template>
                <!--{{ item.name }} -> slot content -->
              </Tile>

            </RouterLink>
          </ResizableGrid>

        </Collapsable>
      </div>
      <!-- COLLAPSABLE FLOOR -->
    </div>
    <div class="h-100" v-else>

      <div class="row h-100 display-flex text-center">

        <ResizableGrid :items="items" v-slot="{ item }">
          <RouterLink custom :to="{
            name: '/rooms/:_id',
            params: {
              _id: item._id,
            },
          }" v-slot="{ href, navigate }">

            <Tile :href="href" @click="navigate" style="background: transparent; border: 1px solid #000">
              <template #icon>
                <i class="fa-3x" :class="item.icon || 'fa-solid fa-question'"></i>
              </template>
              <template #title>{{ item.name }} </template>
              <!--{{ item.name }} -> slot content -->
              <span v-if="item.floor" class="text-secondary fw-light"
                style="position: absolute; bottom: 15px; left: 0; right: 0;">
                Floor: {{ isNumber(item.floor) ? item.floor : "not set" }}
              </span>
            </Tile>

          </RouterLink>
        </ResizableGrid>

      </div>

      <!-- DONT GROUP -->
      <!-- 1) remove h-100 to remove spaces between tiles -->
      <!--
      <div class="row h-100 display-flex text-center">
        <RouterLink v-bind:key="item._id" v-for="item in items" custom :to="{
          name: '/rooms/:_id',
          params: {
            _id: item._id,
          },
        }" v-slot="{ href, navigate }">
          <div class="col-6 col-sm-6 col-md-4 col-lg-3 col-xxl-2" :style="{ 'padding': `${settings.layout.gap}px` }">
            <Tile :href="href" @click="navigate" style="background: transparent; border: 1px solid #000">
              <template #icon>
                <i class="fa-3x" :class="item.icon || 'fa-solid fa-question'"></i>
              </template>
              <template #title>{{ item.name }} </template>
              <!--{{ item.name }} -> slot content --
              <span class="text-secondary fw-light" style="position: absolute; bottom: 15px; left: 0; right: 0;">
                Floor: {{ isNumber(item.floor) ? item.floor : "not set" }}
              </span>
            </Tile>
          </div>
        </RouterLink>
      </div>
    -->
      <!-- DONT GROUP -->

    </div>
  </div>
</template>

<!--

The tiles beave a litle bit wierd:
- See isseu #2 comment
- Tiles should shrink if not enough there
- Should grow when tenough x there
- consume full height of row when needed (above condition)
-->

<style scope>
.row.display-flex {
  display: flex;
  flex-wrap: wrap;
}

.row.display-flex>[class*="col-"] {
  flex-grow: 0;
  /* 1) set max-height to shrink tiles */
  /*max-height: 300px;*/
}

/*
[class*="col-"] {
  color: transparent;
  text-shadow: 0 0 25px rgba(0, 0, 0, 0.4);
}
*/
</style>
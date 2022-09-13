<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "@/components/Collapsable.vue";
import { store } from "../store";
import { groupObjByKey } from "@/helper";
</script>

<script>
export default {
  components: {
    Collapsable,
    Tile,
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
      //return [...store.rooms, ...store.rooms, ...store.rooms];
      return store.rooms;
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
    <!--
    <div class="row mb-3" v-if="!hideButtonGrouping">
      <div class="col">
        <button
          class="btn btn-outline-primary"
          @click="groupItems = !groupItems"
        >
          Toggle Grouping
        </button>
      </div>
    </div>
    -->

    <div v-if="groupItems">
      <!-- COLLAPSABLE FLOOR -->
      <div class="row" v-bind:key="index" v-for="(rooms, index) in floors">
        <Collapsable>
          <template #title>Floor: {{ index }}</template>
          <RouterLink
            v-bind:key="item._id || Date.now()"
            v-for="item in rooms"
            custom
            :to="{
              name: '/rooms/:_id',
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
    <div class="h-100" v-else>
      <!-- DONT GROUP -->
      <div class="row h-100 display-flex text-center">
        <RouterLink
          v-bind:key="item._id"
          v-for="item in items"
          custom
          :to="{
            name: '/rooms/:_id',
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
              class="border-secondary"
              style="background: transparent"
            >
              <template #icon>
                <i
                  class="fa-3x"
                  :class="item.icon || 'fa-solid fa-question'"
                ></i>
              </template>
              <template #title>{{ item.name }} </template>
              <!--{{ item.name }} -> slot content -->
              <span class="text-secondary fw-light">
                Floor: {{ item.floor || "not set" }}
              </span>
            </Tile>
          </div>
        </RouterLink>
      </div>
      <!-- DONT GROUP -->
    </div>
  </div>
</template>

<style scope>
.row.display-flex {
  display: flex;
  flex-wrap: wrap;
}
.row.display-flex > [class*="col-"] {
  flex-grow: 1;
}
</style>
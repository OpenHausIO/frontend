<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "@/components/Collapsable.vue";
import { store } from "../store";
</script>

<script>
export default {
  components: { Collapsable, Tile },
  data() {
    return {
      items: store.rooms,
      floors: {},
      groupItems: true,
      hideButtonGrouping: false,
    };
  },
  mounted() {
    this.floors = Array.from(this.items).reduce((obj, item) => {
      obj[item.floor] = obj[item.floor] || [];
      obj[item.floor].push(item);
      return obj;
    }, {});

    if (Object.keys(this.floors).length === 1) {
      this.groupItems = false;
      //this.hideButtonGrouping = true;
    }
  },
};
</script>

<template>
  <div class="container-fluid">
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

    <div>
      <!-- DONT GROUP -->
      <div class="row">
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
          <div class="col-2 mb-4">
            <Tile
              :href="href"
              @click="navigate"
              class="border-dark"
              style="background: transparent"
            >
              <template #icon>
                <i class="fa-2xl" :class="item.icon"></i>
              </template>
              <template #title>{{ item.name }} </template>
              <!--{{ item.name }} -> slot content -->
            </Tile>
          </div>
        </RouterLink>
      </div>
      <!-- DONT GROUP -->
    </div>
  </div>
</template>
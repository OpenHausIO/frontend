<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "@/components/Collapsable.vue";
import { store } from "../store";
import { getRoomNameById, getDeviceNameById } from "@/helper";
</script>

<script>
export default {
  components: { Collapsable, Tile },
  data() {
    return {
      items: store.devices,
    };
  },
  mounted() {
    /*
    this.devices = Array.from(this.items.devices).reduce((obj, item) => {
      obj[item.device] = obj[item.device] || [];
      obj[item.device].push(item);
      return obj;
    }, {});
    */
  },
  methods: {
    getDeviceNameById,
    getRoomNameById,
  },
};
</script>

<template>
  <div class="container-fluid">
    <!-- DONT GROUP -->
    <div class="row">
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
        <div class="col-2 mb-4">
          <Tile :href="href" @click="navigate" class="bg-dark border-secondary">
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

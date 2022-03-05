<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "../components/Collapsable.vue";
</script>

<script>
export default {
  components: { Collapsable, Tile },
  data() {
    return {
      items: window.store.devices,
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
    getDeviceNameById(_id) {
      let device = Array.from(window.store.devices).find((obj) => {
        return obj._id === _id;
      });

      if (!device) {
        return "Nope";
      }

      return device.name;
    },
    getRoomNameById(_id) {
      let room = Array.from(window.store.rooms).find((obj) => {
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

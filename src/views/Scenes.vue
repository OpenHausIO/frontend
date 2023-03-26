<script setup>
import Collapsable from "@/components/Collapsable.vue";
import Tile from "@/components/Tile.vue";
import { request } from "@/helper";
</script>

<script>
import { itemStore } from "../store.js";
const store = itemStore();

export default {
  components: {
    Collapsable,
    Tile,
  },
  data() {
    return {
    };
  },
  computed: {
    items() {
      return store.scenes;
    },
  },
  methods: {
    trigger(item) {
      request(
        `/api/scenes/${item._id}/trigger`,
        {
          method: "POST",
        },
        (err, result) => {
          console.log(err, result);
        }
      );
    }
  }
};
</script>

<template>
  <div class="container-fluid">
    <!-- COMMANDS/STATES/SCENES -->
    <div class="row display-flex text-center" style="height: 100%">
      <!-- COMMANDS -->
      <div class="p-0 col-6 col-md-3 col-xl-2" v-bind:key="item._id" v-for="item in items">
        <Tile style="background: transparent; border: 1px solid rgb(0, 0, 0)" @click="trigger(item, $event)">
          {{ item.name }}
        </Tile>
      </div>
      <!-- COMMANDS -->

    </div>
    <!-- COMMANDS/STATES/SCENES -->
  </div>
</template>

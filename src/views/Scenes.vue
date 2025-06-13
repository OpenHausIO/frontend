<script setup>
import Collapsable from "@/components/Collapsable.vue";
import Tile from "@/components/Tile.vue";
import { request } from "@/helper";
</script>

<script>
import { itemStore } from "../store.js";
const store = itemStore();

import CommandParameter from "../components/CommandParameter.vue";

export default {
  components: {
    CommandParameter,
    Collapsable,
    Tile,
  },
  data() {
    return {
    };
  },
  computed: {
    items() {
      return store.scenes.filter(({ visible }) => {
        return visible;
      }).map((item) => {

        // if item does not have .input array
        // monkey patch empty one to keep app working
        item.inputs = item?.input ?? [];
        return item;

      });
    },
  },
  methods: {
    trigger(item) {
      request(`/api/scenes/${item._id}/trigger`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          inputs: item.inputs.map(({ key, value }) => {
            return { key, value };
          })
        })
      }, (err, result) => {
        console.log(err, result);
      });
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
        <Tile @click="item?.inputs?.length === 0 && trigger(item, $event)">

          <template #icon>
            <i class="fa-2xl" :class="item.icon || 'fa-regular fa-circle-question'"></i>
          </template>

          <template #title>
            {{ item.name }}
          </template>

          <CommandParameter v-if="item?.inputs?.length > 0" :param="param" v-for="param in item?.inputs || []"
            @changed="trigger(item, $event)">
          </CommandParameter>

        </Tile>
      </div>
      <!-- COMMANDS -->

    </div>
    <!-- COMMANDS/STATES/SCENES -->
  </div>
</template>

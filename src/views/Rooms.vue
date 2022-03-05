<script setup>
import Tile from "@/components/Tile.vue";
import Collapsable from "../components/Collapsable.vue";
</script>

<script>
export default {
  components: { Collapsable, Tile },
  data() {
    return {
      items: window.store.rooms,
      floors: {},
      groupItems: true,
    };
  },
  mounted() {
    this.floors = Array.from(this.items).reduce((obj, item) => {
      obj[item.floor] = obj[item.floor] || [];
      obj[item.floor].push(item);
      return obj;
    }, {});
  },
};
</script>

<template>
  <div class="container-fluid">
    <div class="row mb-3">
      <div class="col">
        <button
          class="btn btn-outline-primary"
          @click="groupItems = !groupItems"
        >
          Toggle Grouping
        </button>
      </div>
    </div>

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
                  <i class="fa-2xl" :class="item.icon"></i>
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
    <div v-else>
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
              class="bg-dark border-secondary"
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

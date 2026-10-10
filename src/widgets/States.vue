<script>
import { defineComponent, defineAsyncComponent } from "vue";
import Modal from "../components/Modal.vue";
import Frame from "../components/Frame.vue";
import { itemStore } from "../store.js";
import WidgetGrid from "../components/WidgetGrid.vue";
import Item from "../components/Item.vue";
import Tile from "../components/Tile.vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "States",
  setup() {

    const items = itemStore();

    return {
      items
    };

  },
  props: {
    uuid: {
      type: String,
      required: true,
    }
  },
  components: {
    Modal,
    Frame,
    Widget,
    WidgetGrid,
    Item,
    Tile
  },
  data() {
    return {
      isModalVisible: false,
      menu: [{
        title: "Select stats",
        method: "selectStats",
      }],
      data: {
        wantedStates: [],
        showRoomName: true,
        showEndpointName: true
      },
    };
  },
  computed: {
    rooms() {
      return this.items.rooms;
    },
    endpoints() {
      return this.items.endpoints;
    },
    endpointStats() {
      return this.endpoints.reduce((acc, item) => {

        // acc[item._id] = this.item.states; // 
        acc[item._id] = item?.states || []; // 

        return acc;

      }, {});
    },
    wantedStateItems() {
      return this.data.wantedStates.map((_id) => {

        const state = this.getStateById_asdf24443(_id);
        if (!state) return null;

        const endpoint = this.getEndpointByState(_id);
        const room = endpoint ? this.getRoomById(endpoint.room) : null;

        return {
          state,
          endpointName: endpoint?.name || "undefined",
          roomName: room?.name || "room not set",
        };

      }).filter(Boolean);
    },
  },
  methods: {
    selectStats() {
      this.isModalVisible = true;
    },
    onCloseModal() {
      this.isModalVisible = false;
    },
    onModalConfirm() {
      this.isModalVisible = false;
    },
    getStateById_asdf24443(_id) {
      return this.endpoints.map(({ states }) => {
        return states;
      }).flat().find((state) => {
        return state._id === _id;
      });
    },
    getRoomById(_id) {
      return this.rooms.find((room) => {
        return room._id === _id;
      }) || {};
    },
    getEndpointById(_id) {
      return this.endpoints.find((endpoint) => {
        return endpoint._id === _id;
      });
    },
    getNameById(_id) {
      return this.getEndpointById(_id)?.name;
    },
    getEndpointByState(_id) {
      return this.endpoints.find(({ states }) => {
        return states.find((state) => {
          return state._id === _id;
        });
      });
    },
    selectedMenu(menu) {
      this[menu.method]();
    },
    loaded(data) {
      Object.assign(this.data, data);
    }
  },
});
</script>

<template>
  <Widget name="States" :menu="menu" @menu="selectedMenu" :uuid="uuid" :data="data" @loaded="loaded">

    <!-- OPTIONS -->
    <template #options>

      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="showRoomName" v-model="data.showRoomName" />
        <label class="form-check-label small" for="showRoomName">
          Show Room name
        </label>
      </div>

      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="showEndpointName" v-model="data.showEndpointName" />
        <label class="form-check-label small" for="showEndpointName">
          Show Endpoint name
        </label>
      </div>

    </template>
    <!-- OPTIONS -->

    <Modal :visible="isModalVisible" @close="onCloseModal" @confirm="onModalConfirm" title="Select states to display">
      <template #body>
        <div class="row" v-for="(states, endpoint, index) in endpointStats" :key="index">
          <div class="col">

            <h6> {{ getNameById(endpoint) }}</h6>

            <ul v-if="states.length > 0">
              <li v-for="(state, i) in states" :key="i">

                <div class="form-check form-switch">
                  <label>

                    <input class="form-check-input" type="checkbox" role="switch" :value="state._id"
                      v-model="data.wantedStates">
                    {{ state.name }}

                  </label>
                </div>

              </li>
            </ul>
            <span v-else>
              <i class="text-secondary fw-light">no states</i>
            </span>

            <!-- VISUAL BARRIER (skip for last entry) -->
            <hr v-if="index + 1 < Object.keys(endpointStats).length" />
            <!-- VISUAL BARRIER (skip for last entry) -->

          </div>
        </div>
      </template>
    </Modal>

    <!--
    <WidgetGrid :items="data.wantedStates">
      <template #default="{ item: _id }">
        <Frame style="position: relative;" class="h-100">
          <div class="d-flex flex-column align-items-center justify-content-center h-100 pb-4">
            <h5>{{ getStateById_asdf24443(_id)?.name || "undefined" }}</h5>
            <h6>{{ getStateById_asdf24443(_id)?.value || "undefined" }}</h6>
          </div>
          <span class="text-secondary fw-light"
            style="position: absolute; bottom: 10px; left: 0; right: 0; text-align: center;"
            v-if="data.showEndpointName">
            {{ getEndpointByState(_id)?.name || "undefined" }}
          </span>
          <small v-if="data.showRoomName">
            ({{ getRoomById(getEndpointByState(_id)?.room)?.name || "room not set" }})
          </small>
        </Frame>
      </template>
    </WidgetGrid>
  -->

    <WidgetGrid :items="wantedStateItems">
      <template #default="{ item }">
        <Item :title="item.state.name || 'undefined'" :subtitle="item.state.value || 'undefined'"
          :footer="data.showEndpointName ? item.endpointName : null" :icon="item.state.icon || 'fa-solid fa-question'"
          :room="data.showRoomName ? item.roomName : null" />
      </template>
    </WidgetGrid>

  </Widget>
</template>

<style scoped>
.dashboard-widget {
  height: 100%;
}

.scene-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0;
  height: 100%;
  text-align: center;
}

.scene-item {
  min-height: 100px;
}

small {
  font-size: 10px;
}
</style>
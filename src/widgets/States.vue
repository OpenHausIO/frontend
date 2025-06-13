<template>

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
                    v-model="wantedStates">
                  {{ state.name }}

                </label>
              </div>
              <!--
              <label>
                <input type="checkbox" :value="state._id" v-model="wantedStates"> 
                {{ state.name }}
              </label>
            -->
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

  <div class="p-2 h-100">

    <h3>
      States: <input type="text" v-model="title" v-if="showTitleTextbox" />
      <span v-else>
        {{ title }}
      </span>
    </h3>

    <div class="container-fluid p-0">
      <div class="h-100">
        <div class="row h-100 display-flex text-center">

          <div class="p-0 col" v-for="_id in wantedStates">
            <Tile>

              <h5>{{ getStateById_asdf24443(_id).name }}</h5>
              <h6>{{ getStateById_asdf24443(_id).value }}</h6>

              <!-- INFO -->
              <span class="text-secondary fw-light">
                {{ getEndpointByState(_id).name }}
                <br />
                <small>
                  ({{ getRoomById(getEndpointByState(_id).room)?.name || "room not set" }})
                </small>
              </span>
              <!-- INFO -->

            </Tile>
          </div>


        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { defineComponent } from "vue";
import Modal from "../components/Modal.vue";
import Tile from "../components/Tile.vue";
import { itemStore } from "../store.js";

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
    Tile
  },
  data() {
    return {
      title: "",
      isModalVisible: false,
      showTitleTextbox: false,
      endpoint: "",
      wantedStates: []
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
        acc[item._id] = this.item.states;
        return acc;
      }, {});
    }
  },
  mounted() {
    this.loadLocalStorage();
  },
  created() { },
  methods: {
    selectStats() {
      this.isModalVisible = true;
    },
    onCloseModal() {
      this.isModalVisible = false;
    },
    onModalConfirm() {

      this.isModalVisible = false;
      this.saveLocalStorage();

    },
    dispatchEvent(event) {
      console.log("Dispatch event in child called", event);
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
    editTitle() {
      this.showTitleTextbox = true;
    },
    closeEdit() {
      this.showTitleTextbox = false;
      this.saveLocalStorage();
    },
    saveLocalStorage() {

      let str = JSON.stringify({
        title: this.title,
        wantedStates: this.wantedStates
      });

      window.localStorage.setItem(`widget-${this.uuid}`, str);

    },
    loadLocalStorage() {

      let str = window.localStorage.getItem(`widget-${this.uuid}`);

      if (!str) {
        return;
      }

      let data = JSON.parse(str);

      this.title = data.title;
      this.wantedStates = data.wantedStates;

    }
  },
  menu: [{
    title: "Select stats",
    method: "selectStats",
  }, {
    title: "Edit title",
    method: "editTitle",
  }, {
    title: "Done editing",
    method: "closeEdit",
  }]
});
</script>

<style scoped>
.row.display-flex {
  display: flex;
  flex-wrap: wrap;
}

.row.display-flex>[class*="col-"] {
  flex-grow: 0;
  /* 1) set max-height to shrink tiles */
  /*max-height: 300px;*/
}

small {
  font-size: 10px;
}
</style>
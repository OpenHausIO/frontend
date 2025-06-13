<template>

  <Modal :visible="isModalVisible" @close="onCloseModal" @confirm="onModalConfirm" title="Select scenes to display">
    <template #body>
      <div class="row">
        <div class="col">

          <ul v-if="scenes.length > 0">
            <li v-for="(scene, i) in scenes" :key="i">

              <div class="form-check form-switch">
                <label>

                  <input class="form-check-input" type="checkbox" role="switch" :value="scene._id"
                    v-model="wantedScenes">
                  {{ scene.name }}

                </label>
              </div>

            </li>
          </ul>
          <span v-else>
            <i class="text-secondary fw-light">no scenes</i>
          </span>

        </div>
      </div>
    </template>
  </Modal>

  <div class="p-2 h-100">

    <h3>
      Scenes: <input type="text" v-model="title" v-if="showTitleTextbox" />
      <span v-else>
        {{ title }}
      </span>
    </h3>

    <div class="container-fluid p-0">
      <div class="h-100">
        <div class="row h-100 display-flex text-center">

          <div class="p-0 col" v-for="_id in wantedScenes">
            <Tile @click="trigger(getScenesById(_id), $event)" style="cursor: pointer;">
              <template #icon>
                <i class="fa-2xl" :class="getScenesById(_id).icon || 'fa-regular fa-circle-question'"></i>
              </template>
              <template #title>
                {{ getScenesById(_id).name }}
              </template>
              <!--
              <template #default>

                {{ getScenesById(_id).timestamps }}
                {{ getScenesById(_id).states }}

              </template>
              -->
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
import { request } from "@/helper";
import { itemStore } from "../store.js";

export default defineComponent({
  name: "Scenes",
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
      wantedScenes: []
    };
  },
  computed: {
    rooms() {
      return this.items.rooms;
    },
    endpoints() {
      return this.items.endpoints;
    },
    scenes() {
      return this.items.scenes;
    }
  },
  mounted() {
    this.loadLocalStorage();
  },
  methods: {
    selectScenes() {
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
    getScenesById(_id) {
      return this.scenes.find((scene) => {
        return scene._id === _id;
      });
    },
    trigger(item) {
      request(`/api/scenes/${item._id}/trigger`, {
        method: "POST",
      }, (err, result) => {
        console.log(err, result);
      });
    },
    /*
    // maybe used later when rooms can set on scenes items
    getRoomById(_id) {
      return this.rooms.find((room) => {
        return room._id === _id;
      }) || {};
    },
    */
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
        wantedScenes: this.wantedScenes
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
      this.wantedScenes = data.wantedScenes;

    }
  },
  menu: [{
    title: "Select scenes",
    method: "selectScenes",
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
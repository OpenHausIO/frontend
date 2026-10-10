<template>
  <Widget name="Scenes" :menu="menu" @menu="selectedMenu" :uuid="uuid" ref="widget" :data="data" @loaded="loaded">

    <Modal :visible="isModalVisible" @close="onCloseModal" @confirm="onModalConfirm" title="Select scenes to display">
      <template #body>
        <div class="row">
          <div class="col">

            <ul v-if="scenes.length > 0">
              <li v-for="(scene, i) in scenes" :key="scene._id">

                <div class="form-check form-switch">
                  <label>

                    <input class="form-check-input" type="checkbox" role="switch" :value="scene._id"
                      v-model="data.wantedScenes">
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

    <!--
    <WidgetGrid :items="data.wantedScenes">
      <template #default="{ item: _id }">
        <Frame @click="trigger(getScenesById(_id), $event)" style="cursor: pointer;" class="h-100">

          <div class="d-flex flex-column align-items-center justify-content-center h-100">
            <i class="d-block" :class="getScenesById(_id)?.icon || 'fa-regular fa-circle-question'"
              style="font-size: 25px"></i>
            {{ getScenesById(_id)?.name || "undefined" }}
          </div>

        </Frame>
      </template>
    </WidgetGrid>
  -->

    <WidgetGrid :items="wantedSceneItems">
      <template #default="{ item: scene }">
        <Item :icon="scene.icon || 'fa-regular fa-circle-question'" :title="scene.name || 'undefined'"
          @click="trigger(scene, $event)" />
      </template>
    </WidgetGrid>

  </Widget>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import Modal from "../components/Modal.vue";
import Tile from "../components/Tile.vue";
import Frame from "../components/Frame.vue";
import { request } from "@/helper";
import { itemStore, settingsStore } from "../store.js";
import WidgetGrid from "../components/WidgetGrid.vue";
import Item from "../components/Item.vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "Scenes",
  setup() {

    const items = itemStore();
    const settings = settingsStore();

    return {
      items,
      settings
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
    Tile,
    Widget,
    Frame,
    WidgetGrid,
    Item
  },
  data() {
    return {
      isModalVisible: false,
      data: {
        wantedScenes: [],
      },
      menu: [{
        title: "Select scenes",
        method: "selectScenes",
      }]
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
    },
    wantedSceneItems() {
      return this.data.wantedScenes.map((_id) => {
        return this.getScenesById(_id);
      }).filter(Boolean);
    }
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
    },
    selectedMenu(menu) {
      this[menu.method]();
    },
    loaded(data) {
      Object.assign(this.data, data);
    }
  }
});
</script>

<style scoped>
.dashboard-widget {
  height: 100%;
}

.scene-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  /*gap: 0.5rem;*/
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
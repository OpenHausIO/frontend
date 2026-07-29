<template>
  <Widget name="Commands" :menu="menu" @menu="selectedMenu" :uuid="uuid" :data="data" @loaded="loaded">

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

      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="showParameterInCommands"
          v-model="data.showParameterInCommands" />
        <label class="form-check-label small" for="showParameterInCommands">
          Handle Command Params in Tile
        </label>
      </div>

    </template>
    <!-- OPTIONS -->

    <Modal :visible="isModalVisible" @close="onCloseModal" @confirm="onModalConfirm" title="Select commands to display">
      <template #body>
        <div class="row" v-for="(commands, endpoint, index) in endpointCommands" :key="index">
          <div class="col">

            <h6> {{ getNameById(endpoint) }}</h6>

            <ul v-if="commands.length > 0">
              <li v-for="(command, i) in commands" :key="i">

                <div class="form-check form-switch">
                  <label>

                    <input class="form-check-input" type="checkbox" role="switch" :value="command._id"
                      v-model="data.wantedCommands">
                    {{ command.name }}

                  </label>
                </div>

              </li>
            </ul>
            <span v-else>
              <i class="text-secondary fw-light">no commands</i>
            </span>

            <!-- VISUAL BARRIER (skip for last entry) -->
            <hr v-if="index + 1 < Object.keys(endpointCommands).length" />
            <!-- VISUAL BARRIER (skip for last entry) -->

          </div>
        </div>
      </template>
    </Modal>

    <!--
    <WidgetGrid :items="commands">
      <template #default="{ item: cmd }">

        <Frame @click="triggerCommand(cmd._id)" style="cursor: pointer;" class="h-100">
          <div class="d-flex flex-column align-items-center justify-content-center h-100">

            {{ cmd.name }}

            <span class="text-secondary fw-light" v-if="data.showEndpointName">
              {{ getEndpointByCommand(cmd._id)?.name || "undefined" }}
            </span>

            <small class="text-secondary fw-light" style="position: absolute; bottom: 25px;" v-if="data.showRoomName">
              {{ getRoomById(getEndpointByCommand(cmd._id)?.room)?.name || "room not set" }}
            </small>

          </div>
        </Frame>

      </template>
    </WidgetGrid>
    -->

    <WidgetGrid :items="enrichedCommands">
      <template #default="{ item }">
        <Item :title="item.cmd.name" :footer="data.showEndpointName ? item.endpointName : null"
          :room="data.showRoomName ? item.roomName : null" :icon="item.cmd.icon"
          @click="triggerCommand(item.cmd, item.showParameterInCommands)">

          <CommandParameter v-for="param in item.cmd.params" :key="param.key" :param="param" :command="item.cmd"
            :shared="item.shared" v-if="item.showParameterInCommands" @changed="triggerCommand(item.cmd, true)" />

          <Modal v-if="!item.showParameterInCommands && item.cmd.params?.length > 0"
            :visible="showCommandParameterModal && activeParamCommandId === item.cmd._id"
            @close="showCommandParameterModal = false; activeParamCommandId = null"
            :title="item.cmd.name + ' ' + item.endpointName" :buttons="['close']">
            <template #body>

              <CommandParameter v-for="param in item.cmd.params" :key="param.key" :param="param" :command="item.cmd"
                :shared="item.shared" @changed="triggerCommand(item.cmd, true)" />

            </template>
          </Modal>

        </Item>
      </template>
    </WidgetGrid>

  </Widget>
</template>

<script>
import { defineComponent, defineAsyncComponent, reactive } from "vue";
import Modal from "../components/Modal.vue";
import Frame from "../components/Frame.vue";
import CommandParameter from "../components/CommandParameter.vue";
import { itemStore } from "../store.js";
import { request } from "../helper.js";
import WidgetGrid from "../components/WidgetGrid.vue";
import Item from "../components/Item.vue";
import Tile from "../components/Tile.vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "Commands",
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
    CommandParameter,
    Widget,
    WidgetGrid,
    Item,
    Tile
  },
  data() {
    return {
      isModalVisible: false,
      showCommandParameterModal: false,
      activeParamCommandId: null,
      data: {
        wantedCommands: [],
        showEndpointName: true,
        showRoomName: true,
        showParameterInCommands: false
      },
      menu: [{
        title: "Select commands",
        method: "selectCommands",
      }],
    };
  },
  computed: {
    rooms() {
      return this.items.rooms;
    },
    endpoints() {
      return this.items.endpoints;
    },
    endpointCommands() {
      return this.endpoints.reduce((acc, item) => {
        acc[item._id] = item?.commands || [];
        return acc;
      }, {});
    },
    commands() {
      return this.endpoints
        .map(({ commands }) => commands)
        .flat()
        .filter((cmd) => this.data.wantedCommands.includes(cmd._id));
    },
    // NEU: reichert jedes Command direkt mit Endpoint/Room an
    enrichedCommands() {
      return this.commands.map((cmd) => {
        const endpoint = this.getEndpointByCommand(cmd._id);
        const room = endpoint ? this.getRoomById(endpoint.room) : null;

        return {
          cmd,
          endpointName: endpoint?.name || "undefined",
          roomName: room?.name || "room not set",
          icon: endpoint?.icon || "fa-solid fa-question",
          shared: reactive({}),
          showParameterInCommands: cmd.params?.length > 0 && this.data.showParameterInCommands
        };

      });
    },
  },
  methods: {
    triggerCommand(command, showParameterInCommands) {

      const hasParams = command.params?.length > 0;

      // Nur Modal öffnen, wenn der Command Parameter hat
      // UND diese nicht schon inline in der Tile angezeigt werden
      if (hasParams && !showParameterInCommands) {
        this.activeParamCommandId = command._id;
        this.showCommandParameterModal = true;
        return;
      }

      const endpoint = this.getEndpointByCommand(command._id);

      let body = [];

      if (command.params) {
        body = command.params.map(({ key, value }) => ({ key, value }));
      }

      request(`/api/endpoints/${endpoint._id}/commands/${command._id}`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(body)
      }, (err, result) => {
        console.log(err, result);
      });

    },
    selectCommands() {
      this.isModalVisible = true;
    },
    onCloseModal() {
      this.isModalVisible = false;
    },
    onModalConfirm() {
      this.isModalVisible = false;
    },
    getStateById_asdf24443(_id) {
      return this.endpoints.map(({ commands }) => {
        return commands;
      }).flat().find((command) => {
        return command._id === _id;
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
    getEndpointByCommand(_id) {
      return this.endpoints.find(({ commands }) => {
        return commands.find((command) => {
          return command._id === _id;
        });
      });
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
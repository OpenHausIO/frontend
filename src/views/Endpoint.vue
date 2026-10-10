<script>
import { reactive, watch } from "vue";
import { mapActions } from "pinia";
import { itemStore, settingsStore } from "../store.js";
import GridDraggable from "../components/GridDraggable.vue";
import Grid from "../components/GridDraggable.vue";
import PageLayouts from "../components/PageLayouts.vue";
import Tile from "@/components/Tile.vue";
import CommandParameter from "@/components/CommandParameter.vue";
import { useRoute, RouterLink } from "vue-router";
import { alert, request, debounce } from "@/helper";
import dateformat from "dateformat";
import ResizableGrid from "../components/ResizableGrid.vue";


export default {
  components: {
    Tile,
    RouterLink,
    CommandParameter,
    GridDraggable,
    Grid,
    PageLayouts,
    ResizableGrid
  },
  setup() {

    const store = itemStore();
    const settings = settingsStore();

    return {
      store,
      settings,
      dateformat
    };

  },
  data() {
    return {
      data: {
        commands: [],
        states: []
      },
      animations: reactive({}),
      shareds: {}
    };
  },
  mounted() {
    let $route = useRoute();

    this.data = Array.from(this.store.endpoints).find((item) => {
      return item._id === $route.params._id;
    });

    // create for each command
    // a shared params object
    this.data.commands.forEach(({ _id }) => {
      this.shareds[_id] = {};
    });

    this.data.states.forEach(({ _id }) => {
      this.animations[_id] = false;
    });

    watch(() => {
      return this.data.states.map(({ _id, value }) => ({ _id, value }));
    }, (newValues, oldValues) => {

      const oldById = new Map(oldValues.map(item => [item._id, item.value]));

      newValues.forEach(({ _id, value }) => {
        const oldValue = oldById.get(_id);

        if (oldValue !== undefined && value !== oldValue && this.settings.enableAnimationOnStateUpdate) {
          this.animations[_id] = true;
        }
      });

    }, {
      deep: false
    });

  },
  methods: {
    //getRoomNameById,
    ...mapActions(itemStore, ["getRoomNameById", "getDeviceNameById"]),
    alert,
    trigger: debounce(function (_id) {

      let command = this.data.commands.find((obj) => {
        return obj._id === _id;
      });

      if (!command) {
        console.warn("Could not find command with _id: ", _id);
        return;
      }

      let body = [];

      if (command.params) {
        body = command.params.map(({ key, value }) => {
          return {
            key,
            value
          };
        });
      }

      request(`/api/endpoints/${this.data._id}/commands/${_id}`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(body)
      }, (err, result) => {
        console.log(err, result);
      });

    }, 50),
    repeat(cmd) {
      //this.trigger(cmd._id);
    },
    resetAnimation(index) {
      this.animations[index] = false;
    },
  },
  computed: {
    commands() {
      // TODO: add filter "enabled"?
      return this.data.commands?.length || 0;
    },
    states() {
      // TODO: add filter "enabled"?
      return this.data.states?.length || 0;
    },
    /*
    scenes() {
      return Math.round(Math.random() * 10);
    },*/
    items() {

      let commands = this.data.commands.map((state) => {
        state.type = "command";
        return state;
      });

      let states = this.data.states.map((state) => {
        state.type = "state";
        return state;
      });

      return [...commands, ...states];

    },
    containerHeight() {
      const settings = settingsStore();
      const gap = Number(settings.layout.gap);
      return { height: `calc(100% - ${94 + gap}px)` };
    },
    paddingStyle() {
      return {
        "padding-top": `${this.settings.layout.gap}px`,
        "padding-left": `${this.settings.layout.gap}px`,
        "padding-right": `${this.settings.layout.gap}px`
      }
    }
  }
};
</script>

<template>
  <div v-if="data?.pages?.length > 0 && settings.useRemoteLayoutPages" class="h-100">

    <PageLayouts :endpoint="data" @trigger="trigger" />

  </div>
  <div v-else class="container-fluid">

    <!-- HEADER -->
    <div class="row">
      <div class="col-12" :style="paddingStyle">
        <div class="card bg-transparent w-100" :style="{ 'border-radius': `${settings.layout.borderRadius}px` }"
          style="border: 1px solid #000">
          <div class="card-body">

            <div class="row align-items-start">

              <!-- LEFT -->
              <div class="col" style="min-width: 0;">
                <div class="d-inline-flex" style="max-width: 100%;">
                  <div class="me-2 pt-1">
                    <i :class="data.icon || 'fa-solid fa-circle-question'" class="fa-3x"></i>
                  </div>
                  <div style="min-width: 0; overflow: hidden;">
                    <h3 class="mb-0 text-truncate" :class="{ 'truncate': settings.layout.truncate }">
                      {{ data.name }}
                      <!--<sup class="text-secondary">•</sup>-->
                    </h3>
                    <span class="text-secondary fw-light d-block text-truncate">
                      {{ getRoomNameById(data.room) }}
                    </span>
                  </div>
                </div>
              </div>
              <!-- LEFT -->

              <!-- RIGHT -->
              <div class="col-auto text-end flex-shrink-0" style="font-size: 14px"
                v-if="settings.showCommandStatesCounter">
                <span class="text-secondary fw-light d-block">
                  <!--Commands: {{ Math.round(Math.random() * 10) }}-->
                  Commands: {{ commands }}
                </span>
                <span class="text-secondary fw-light d-block">
                  States: {{ states }}
                </span>
              </div>
              <!-- RIGHT -->

            </div>

          </div>
        </div>
      </div>
    </div>
    <!-- HEADER -->

    <!-- HEADER -->
    <div class="row py-4 hide" style="border-top: 1px solid #000; border-bottom: 1px solid #000">

      <!-- LEFT -->
      <div class="col">
        <div class="d-inline-flex">
          <div class="me-2 pt-1">
            <i :class="data.icon || 'fa-solid fa-circle-question'" class="fa-3x"></i>
          </div>
          <div class="">
            <h3 class="mb-0">
              {{ data.name }}
              <!--<sup class="text-secondary">•</sup>-->
            </h3>
            <span class="text-secondary fw-light d-block">
              {{ getRoomNameById(data.room) }}
            </span>
          </div>
        </div>
      </div>
      <!-- LEFT -->

      <!-- RIGHT -->
      <div class="col text-end" style="font-size: 14px" v-if="settings.showCommandStatesCounter">
        <span class="text-secondary fw-light d-block">
          <!--Commands: {{ Math.round(Math.random() * 10) }}-->
          Commands: {{ commands }}
        </span>
        <span class="text-secondary fw-light d-block">
          States: {{ states }}
        </span>
        <!--
        <span class="text-secondary fw-light d-block">
          Scenes: {{ scenes }}
        </span>
        -->
      </div>
      <!-- RIGHT -->

    </div>
    <!-- HEADER -->

    <!-- COMMANDS/STATES/SCENES -->
    <div class="row display-flex text-center" :style="containerHeight">
      <ResizableGrid :items="items" v-slot="{ item }">
        <div v-if="item.type === 'command'">

          <!-- COMMANDS -->
          <RouterLink custom :to="{
            name: '/endpoints/:_id/commands/:_command',
            params: {
              _id: $route.params._id,
              _command: item._id,
            },
          }" v-slot="{ href, navigate }" v-if="item.params?.length > 0 && !settings.showParameterInCommands">
            <Tile :href="href" @click="navigate">
              <template #title>
                <i :class="item.icon || 'fa-regular fa-circle-question'"></i>
              </template>
              {{ item.name }}
            </Tile>
          </RouterLink>

          <Tile v-else @click="trigger(item._id)" v-repeat="{ handler: repeat, interval: 300, command: item }">
            <template #title>
              <i :class="item.icon || 'fa-regular fa-circle-question'"></i>
            </template>
            <div>
              {{ item.name }}
            </div>

            <CommandParameter :param="param" :command="item" :shared="shareds[item._id]" v-for="param in item.params"
              @changed="trigger(item._id)" />

          </Tile>
          <!--COMMANDS -->

        </div>
        <div v-else-if="item.type === 'state'">

          <!--STATES -->
          <Tile>

            <!-- INFORMATION -->
            <h3><i :class="item.icon || 'fa-regular fa-circle-question'"></i></h3>
            <span>{{ item.name }}</span>
            <p :class="{ 'update-indicator': animations[item._id] }" @animationend="resetAnimation(item._id)">
              <span v-if="item.value === null" class="text-warning">
                null
              </span>
              <span v-else>
                {{ item.value }}
              </span>
            </p>
            <!-- INFORMATION -->

            <!-- TIMESTAMP -->
            <small v-if="settings.showUpdateTimestampInStates" class="text-secondary fw-light">
              Updated:<br>
              {{ dateformat(item.timestamps.updated, settings.dateformat) }}
            </small>
            <!-- TIMESTAMP -->

            <!-- GRAPH/HISTORY -->
            <!-- TODO, see <host>/#!/test/chart -->
            <!-- GRAPH/HISTORY -->

          </Tile>
          <!-- STATES -->

        </div>
        <div v-else>

          Type {{ item.type }} not supported

        </div>
      </ResizableGrid>
    </div>
    <!-- COMMANDS/STATES/SCENES -->

  </div>
</template>


<style scope>
small {
  margin-top: 20px;
  display: block;
  font-size: 10px;
}

@keyframes updateIndicatorAnimation {
  0% {
    /*text-shadow: 0 0 0 transparent;*/
    color: rgb(230, 230, 230);
    /*filter: blur(0px);*/
  }

  50% {
    color: rgba(var(--bs-primary-rgb), 1);
    text-shadow: 0px 0px 1px rgba(var(--bs-primary-rgb), 0.3);
    /*filter: blur(3px);*/
  }


  100% {
    /*text-shadow: 0 0 0 transparent;*/
    color: rgb(230, 230, 230);
    /*filter: blur(0px);*/
  }

}

.update-indicator {
  /*animation: updateIndicatorAnimation 0.28s ease-out*/
  animation: updateIndicatorAnimation 0.8s ease-out;
  animation-iteration-count: 1;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
</style>
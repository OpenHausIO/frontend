<script setup>
import Tile from "@/components/Tile.vue";
import CommandParameter from "@/components/CommandParameter.vue";
import { useRoute, RouterLink } from "vue-router";
//import { store } from "@/store";
import { alert, request, debounce } from "@/helper";
import { settingsStore } from "../store.js";
const settings = settingsStore();
import dateformat from "dateformat";
</script>

<script>
import { reactive, watch } from "vue";
import { mapActions } from "pinia";
import { itemStore, settingsStore } from "../store.js";
const store = itemStore();
const settings = settingsStore();

export default {
  components: {
    Tile,
    RouterLink,
    CommandParameter
  },
  data() {
    return {
      data: {
      },
      animations: reactive({})
    };
  },
  mounted() {
    let $route = useRoute();

    this.data = Array.from(store.endpoints).find((item) => {
      return item._id === $route.params._id;
    });

    watch(() => {
      return this.data.states.map(item => item.value);
    }, (newValues, oldValues) => {

      /*
      console.group("Watcher");
      console.log("Old Values:", oldValues);
      console.log("New Values:", newValues);
      */

      newValues.forEach((newValue, index) => {
        if (newValue !== oldValues[index] && settings.enableAnimationOnStateUpdate) {

          //console.log(`Änderung erkannt bei Index ${index}: ${oldValues[index]} -> ${newValue}`);
          this.animations[index] = true;

        }
      });

      //console.groupEnd();

    }, {
      deep: false
    });

  },
  methods: {
    //getRoomNameById,
    ...mapActions(itemStore, ["getRoomNameById", "getDeviceNameById"]),
    alert,
    trigger: debounce(function (_id, event) {

      console.log("Aasdflaksdfleila")

      let command = this.data.commands.find((obj) => {
        return obj._id === _id;
      });

      if (!command) {
        console.warn("Could not find command with _id: ", _id);
        return;
      }

      console.log("command.params", command.params)

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

    }, 10),
    repeat(cmd) {
      this.trigger(cmd._id);
    },
    resetAnimation(index) {
      this.animations[index] = false;
    }
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
  }
};
</script>

<template>
  <div v-if="data?.pages?.length > 0 && settings.useRemoteLayoutPages">

    {{ data.pages }}

  </div>
  <div v-else class="container-fluid">

    <!-- HEADER -->
    <div class="row py-4" style="border-top: 1px solid #000; border-bottom: 1px solid #000">

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
    <div class="row display-flex text-center" style="height: calc(100% - 109px)">

      <!-- COMMANDS -->
      <div class="p-0 col-6 col-md-3 col-xl-2" v-bind:key="command._id" v-for="command in data.commands">
        <RouterLink custom :to="{
          name: '/endpoints/:_id/commands/:_command',
          params: {
            _id: $route.params._id,
            _command: command._id,
          },
        }" v-slot="{ href, navigate }" v-if="command.params?.length > 0 && !settings.showParameterInCommands">
          <Tile style="background: transparent; border: 1px solid rgb(0, 0, 0)" :href="href" @click="navigate">
            <template #title>
              <i :class="command.icon || 'fa-regular fa-circle-question'"></i>
            </template>
            {{ command.name }}
          </Tile>
        </RouterLink>
        <Tile v-else style="background: transparent; border: 1px solid rgb(0, 0, 0)"
          @click="trigger(command._id, $event)" v-repeat="{ handler: repeat, interval: 300, command }">
          <template #title>
            <i :class="command.icon || 'fa-regular fa-circle-question'"></i>
          </template>
          <div>
            {{ command.name }}
          </div>
          <CommandParameter :param="param" v-for="param in command.params" @changed="trigger(command._id, $event)">
          </CommandParameter>
        </Tile>
      </div>
      <!-- COMMANDS -->

      <!-- STATES -->
      <div class="p-0 col-6 col-md-3 col-xl-2" v-bind:key="state._id" v-for="(state, index) in data.states">
        <Tile style="background: transparent; border: 1px solid rgb(0, 0, 0)">

          <!-- INFORMATION -->
          <h3><i :class="state.icon || 'fa-regular fa-circle-question'"></i></h3>
          <div>{{ state.name }}</div>
          <i :class="{ 'meine-text-animation': animations[index] }" @animationend="resetAnimation(index)">
            {{ state.value }}
          </i>
          <!-- INFORMATION -->

          <!-- TIMESTAMP -->
          <small v-if="settings.showUpdateTimestampInStates" class="text-secondary fw-light">
            Updated:<br>
            {{ dateformat(data.timestamps.updated, "yyyy.mm.dd - HH:MM:ss") }}
          </small>
          <!-- TIMESTAMP -->

          <!-- GRAPH/HISTORY -->
          <!-- TODO, see <host>/#!/test/chart -->
          <!-- GRAPH/HISTORY -->

        </Tile>
      </div>
      <!-- STATES -->

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

@keyframes textShadowAnimation {
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

.meine-text-animation {
  /*animation: textShadowAnimation 0.28s ease-out*/
  animation: textShadowAnimation 0.8s ease-out;
  animation-iteration-count: 1;
}
</style>
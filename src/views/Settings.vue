<script>
import { defineComponent, watch, inject, nextTick } from "vue";
import { toggleFullscreen, useEventListener } from "../helper.js";
import { useNotificationStore } from "@dafcoe/vue-notification";

const { setNotification } = useNotificationStore();

export default defineComponent({
  //props: ["href"],
  data() {
    return {
      /*
      settings: {
        // grouping
        groupItems: true,
        groupRoomItems: true,
        groupEndpointItems: true,
        groupDeviceItems: true,
        // visibility
        showSettingsButton: true,
        showBackButton: true,

        collapsed: [],
      },*/
    };
  },
  computed: {
    settings() {
      return inject("settings");
    },
  },
  mounted() {
    console.log("Mounted, watch settings", inject("settings"));

    // save changes that are made
    watch(this.settings, (val) => {
      if (!this.settings.groupItems) {
        this.settings.groupRoomItems = false;
        this.settings.groupEndpointItems = false;
        this.settings.groupDeviceItems = false;
      }

      window.localStorage.setItem("settings", JSON.stringify(val));
    });
  },

  methods: {
    toggleFullscreen,
    showSettingsButtonInfo() {
      nextTick(() => {
        if (this.settings.showSettingsButton) {
          setNotification({
            message:
              "Tap 10x times on any empty space to go to this page again when the settings button is hidden.",
            type: "info",
            showIcon: false,
            dismiss: {
              manually: true,
              automatically: false,
            },
            appearance: "dark",
          });
        }
      });
    },
  },
});
</script>

<template>
  <div class="container-fluid">
    Settings page
    {{ settings }}

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id="groupItemsCheckbox"
        v-model="settings.groupItems"
      />
      <label class="form-check-label small" for="groupItemsCheckbox">
        Group Items
      </label>
    </div>

    <hr />

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id="groupItemsRoomCheckbox"
        v-model="settings.groupRoomItems"
        :disabled="!this.settings.groupItems"
      />
      <label class="form-check-label small" for="groupItemsRoomCheckbox">
        Group Room Items
      </label>
    </div>

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id="groupItemsEndpointCheckbox"
        v-model="settings.groupEndpointItems"
        :disabled="!this.settings.groupItems"
      />
      <label class="form-check-label small" for="groupItemsEndpointCheckbox">
        Group Endpoint Items
      </label>
    </div>

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id="groupItemsDeviceCheckbox"
        v-model="settings.groupDeviceItems"
        :disabled="!this.settings.groupItems"
      />
      <label class="form-check-label small" for="groupItemsDeviceCheckbox">
        Group Device Items
      </label>
    </div>

    <hr />

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id="showSettingsButtonCheckbox"
        v-on:click="showSettingsButtonInfo()"
        v-model="settings.showSettingsButton"
      />
      <label class="form-check-label small" for="showSettingsButtonCheckbox">
        Show Settings buttons
      </label>
    </div>

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id="showBackButtonCheckbox"
        v-model="settings.showBackButton"
      />
      <label class="form-check-label small" for="showBackButtonCheckbox">
        Show Back button
      </label>
    </div>

    <hr />

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id="showVueTourOnNextVisitCheckbox"
        v-model="settings.showVueTourOnNextVisit"
      />
      <label
        class="form-check-label small"
        for="showVueTourOnNextVisitCheckbox"
      >
        Enable Tour on next visit
      </label>
    </div>

    <hr />

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id="editDashboardWidgetsCheckbox"
        v-model="settings.editDashboardWidgets"
      />
      <label class="form-check-label small" for="editDashboardWidgetsCheckbox">
        Edit Dashboard widgets
      </label>
    </div>

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id="showDashboardWidgetsCheckbox"
        v-model="settings.showDashboardWidgets"
      />
      <label class="form-check-label small" for="showDashboardWidgetsCheckbox">
        Show Dashboard widgets
      </label>
    </div>

    <hr />

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id="enableScreenSaverOverlayCheckbox"
        v-model="settings.enableScreenSaverOverlay"
      />
      <label
        class="form-check-label small"
        for="enableScreenSaverOverlayCheckbox"
      >
        Screensaver overlay
      </label>
    </div>

    <input type="number" v-model="settings.screensaverOverlayDelay" />

    <input
      type="range"
      class="form-range"
      v-model="settings.screensaverOverlayDelay"
      min="10"
      max="60"
      step="10"
      id="customRange3"
    />

    <hr />

    <button class="btn btn-outline-primary m-1" @click="toggleFullscreen()">
      Toggle fullscreen
    </button>

    <a
      href="http://localhost:3001"
      class="btn btn-outline-primary m-1"
      target="_blank"
      >Administration
    </a>
  </div>
</template>

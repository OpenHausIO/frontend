<script setup>
import { settingsStore, widgetStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
import { defineComponent, watch, nextTick } from "vue";
import { toggleFullscreen } from "../helper.js";
import { useNotificationStore } from "@dafcoe/vue-notification";
import { v4 as uuid } from "uuid";
import Widget from "../components/Widget.vue";

import { widgetStore } from "../store.js";
const { setNotification } = useNotificationStore();
const widgetsSt = widgetStore();

export default defineComponent({
  data() {
    return {
      widgets: Widget.components,
    };
  },
  mounted() {
    console.log("Mounted, watch settings");

    // save changes that are made
    watch(this.settings, () => {
      if (!this.settings.groupItems) {
        this.settings.groupRoomItems = false;
        this.settings.groupEndpointItems = false;
        this.settings.groupDeviceItems = false;
      }

      if (this.settings.showGradientBackground) {
        document.getElementById("app").classList.remove("bg-dark");
        document.getElementById("app").classList.add("gardien-background");
      } else {
        document.getElementById("app").classList.add("bg-dark");
        document.getElementById("app").classList.remove("gardien-background");
      }
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
    addDashboardWidget(widget) {
      /*
      let widgets = JSON.parse(window.localStorage.getItem("widgets"));

      let i = ((start) => {
        widgets.every((a) => {
          if (start === a) {
            start = a + 1;
            return true;
          }
        });
        return start;
      })(widgets.length + 1);

      widgets.push({
        x: 10,
        y: 12,
        w: 2,
        h: 2,
        uuid: uuid(),
        widget,
        moved: false,
        i,
      });

      window.localStorage.setItem("widgets", JSON.stringify(widgets));
      */

      widgetsSt.add(widget);

      setNotification({
        message: `Widget "${widget}" added to Dashboard`,
        type: "success",
        showIcon: false,
        dismiss: {
          manually: true,
          automatically: true,
        },
        appearance: "dark",
      });
    },
    clearLocalStorage() {
      // clear local "persistent" storage
      window.localStorage.clear();

      setNotification({
        message: "Local storage has been cleaned",
        type: "success",
        showIcon: false,
        dismiss: {
          manually: true,
          automatically: true,
        },
        appearance: "dark",
      });
    },
  },
});
</script>

<template>
  <div class="container-fluid">
    <div class="row pt-3">
      <!-- ITEM GROUPING -->
      <div class="col">
        <div class="card" style="width: 18rem">
          <div class="card-body bg-dark">
            <h5 class="card-title">Item Grouping</h5>

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
                :disabled="!settings.groupItems"
              />
              <label
                class="form-check-label small"
                for="groupItemsRoomCheckbox"
              >
                Group Room Items
              </label>
            </div>

            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="groupItemsEndpointCheckbox"
                v-model="settings.groupEndpointItems"
                :disabled="!settings.groupItems"
              />
              <label
                class="form-check-label small"
                for="groupItemsEndpointCheckbox"
              >
                Group Endpoint Items
              </label>
            </div>

            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="groupItemsDeviceCheckbox"
                v-model="settings.groupDeviceItems"
                :disabled="!settings.groupItems"
              />
              <label
                class="form-check-label small"
                for="groupItemsDeviceCheckbox"
              >
                Group Device Items
              </label>
            </div>
          </div>
        </div>
      </div>
      <!-- ITEM GROUPING -->

      <!-- NAVIGATION -->
      <div class="col">
        <div class="card" style="width: 18rem">
          <div class="card-body bg-dark">
            <h5 class="card-title">Navigation</h5>
            <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="showSettingsButtonCheckbox"
                v-on:click="showSettingsButtonInfo()"
                v-model="settings.showSettingsButton"
              />
              <label
                class="form-check-label small"
                for="showSettingsButtonCheckbox"
              >
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
              <label
                class="form-check-label small"
                for="showBackButtonCheckbox"
              >
                Show Back button
              </label>
            </div>
          </div>
        </div>
      </div>
      <!-- NAVIGATION -->

      <!-- WIDGETS -->
      <div class="col">
        <div class="card" style="width: 18rem">
          <div class="card-body bg-dark">
            <h5 class="card-title">Widgets</h5>

            <!-- CARD CONTENT -->
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="editDashboardWidgetsCheckbox"
                v-model="settings.editDashboardWidgets"
              />
              <label
                class="form-check-label small"
                for="editDashboardWidgetsCheckbox"
              >
                Edit Dashboard widgets
              </label>
            </div>

            <div class="form-check form-switch">
              <label for="dashboardGridColsInput" class="form-label"
                >Cols</label
              >
              <input
                type="number"
                id="dashboardGridColsInput"
                class="form-control bg-dark text-white"
                v-model="settings.dashboardGrid.cols"
                :disabled="!settings.editDashboardWidgets"
              />
            </div>

            <div class="form-check form-switch">
              <label for="dashboardGridRowsInput" class="form-label"
                >Rows</label
              >
              <input
                type="number"
                id="dashboardGridRowsInput"
                class="form-control bg-dark text-white"
                v-model="settings.dashboardGrid.rows"
                :disabled="!settings.editDashboardWidgets"
              />
            </div>

            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="showDashboardWidgetsCheckbox"
                v-model="settings.showDashboardWidgets"
              />
              <label
                class="form-check-label small"
                for="showDashboardWidgetsCheckbox"
              >
                Show Dashboard widgets
              </label>
            </div>

            <hr />

            <div class="btn-group d-block">
              <button
                type="button"
                class="btn btn-primary dropdown-toggle w-100"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Add Widget
              </button>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li v-bind:key="index" v-for="(widget, index) in widgets">
                  <button
                    class="dropdown-item d-flex gap-2 align-items-center"
                    @click="addDashboardWidget(widget.name)"
                  >
                    {{ widget.name }}
                  </button>
                </li>
              </ul>
            </div>
            <!-- CARD CONTENT -->
          </div>
        </div>
      </div>
      <!-- WIDGETS -->

      <!-- SCREENSAVER -->
      <div class="col">
        <div class="card" style="width: 18rem">
          <div class="card-body bg-dark">
            <h5 class="card-title">Screensaver</h5>
            <!-- CONTENT -->
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

            <div class="form-check form-switch">
              <label for="screenSaverOVerlayInput" class="form-label">
                Timeout in Sec.
              </label>
              <input
                type="number"
                id="screenSaverOVerlayInput"
                class="form-control bg-dark text-white"
                v-model="settings.screensaverOverlayDelay"
                :disabled="!settings.enableScreenSaverOverlay"
              />
              <input
                type="range"
                class="form-range"
                v-model="settings.screensaverOverlayDelay"
                min="10"
                max="60"
                step="10"
                :disabled="!settings.enableScreenSaverOverlay"
              />
            </div>

            <!-- CONTENT -->
          </div>
        </div>
      </div>
      <!-- SCREENSAVER -->

      <!-- LOOK & FEEL -->
      <div class="col">
        <div class="card" style="width: 18rem">
          <div class="card-body bg-dark">
            <h5 class="card-title">Look & Feel</h5>
            <!-- CONTENT -->
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="showGradientBackgroundCheckbox"
                v-model="settings.showGradientBackground"
              />
              <label
                class="form-check-label small"
                for="showGradientBackgroundCheckbox"
              >
                Enable Background gardient
              </label>
            </div>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="transparentDashboardWidgetsCheckbox"
                v-model="settings.transparentDashboardWidgets"
              />
              <label
                class="form-check-label small"
                for="transparentDashboardWidgetsCheckbox"
              >
                Transparent Dashboard Widgets
              </label>
            </div>
            <!-- CONTENT -->
          </div>
        </div>
      </div>
      <!-- LOOK & FEEL -->

      <!-- MISCELLANEOUS -->
      <div class="col">
        <div class="card" style="width: 18rem">
          <div class="card-body bg-dark">
            <h5 class="card-title">Miscellaneous</h5>
            <!-- CONTENT -->

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

            <button
              class="btn btn-outline-primary d-block"
              @click="toggleFullscreen()"
            >
              Toggle fullscreen
            </button>

            <button
              class="btn btn-outline-primary d-block"
              @click="clearLocalStorage()"
            >
              Clear localStorage
            </button>

            <a
              href="http://localhost:3001"
              class="btn btn-outline-primary m-1 d-block"
              target="_blank"
              >Administration
            </a>
            <!-- CONTENT -->
          </div>
        </div>
      </div>
      <!-- MISCELLANEOUS -->
    </div>
  </div>
</template>
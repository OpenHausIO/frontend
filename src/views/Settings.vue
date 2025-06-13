<script>
import { defineComponent } from "vue";
import { toggleFullscreen, request } from "../helper.js";
import { useNotificationStore } from "@dafcoe/vue-notification";
import { version } from "../../package.json";
import Widget from "../components/Widget.vue";
import router, { routes } from "../router/index.js";
import { settingsStore, widgetStore, commonStore } from "../store.js";

const { setNotification } = useNotificationStore();

export default defineComponent({
  setup() {

    const settings = settingsStore();
    const widgets = widgetStore();
    const common = commonStore();

    return {
      settings,
      widgets,
      common
    };

  },
  data() {
    return {
      //widgets: Widget.components,
      Widget,
      version,
      routes
    };
  },
  mounted() {
    console.log("Mounted, watch settings");

    // save changes that are made
    /*
    // TODO: Remove, see #42
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

      routes.forEach((route) => {
        route.visible = this.settings[`show${route.name}Button`];
      });
    });
    */
  },

  methods: {
    toggleFullscreen,
    showSettingsButtonInfo() {
      /*
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
      */
    },
    addDashboardWidget(widget) {
      /*
      let widgets = JSON.parse(window.localStorage.getItem("widgets"));

      let i = ((start) => {
        widgets.every((a) => {
          if (start === a.i) {
            start = a.i + 1;
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
        i: i + 1,
      });

      window.localStorage.setItem("widgets", JSON.stringify(widgets));
      */

      this.widgets.add(widget);

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
    clearSettings() {
      // works, but not for widgets
      this.settings.$reset(); // OK
      //widgets.$reset(); // BROKEN!

      // workaround for `widgets.$reset()`
      // reset does not work, pop works!
      while (this.widgets.$state.length > 0) {
        this.widgets.$state.pop();
      }

      // clear local "persistent" storage
      window.localStorage.clear();
      window.sessionStorage.clear();

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

      setTimeout(() => {
        this.common.authenticated = false;
        this.common.navbar = false;
        router.replace({
          path: "/auth/login",
        });
      }, 3000);
    },
    exportSettings() {

      let blob = new Blob([JSON.stringify(window.localStorage, null, 2)], {
        type: "application/json",
      });

      let fileURL = URL.createObjectURL(blob);
      let link = document.createElement("a");

      link.setAttribute("href", fileURL);
      link.setAttribute("download", "settings.json");

      link.click();
      link.remove();

      setNotification({
        message: `Settings have been downloaded as "settings.json"`,
        type: "success",
        showIcon: false,
        dismiss: {
          manually: true,
          automatically: true,
        },
        appearance: "dark",
      });

    },
    importSettings() {
      let reader = new FileReader();
      let input = document.createElement("input");

      reader.addEventListener("loadend", (event) => {
        console.log("file reader", reader.result, event);

        input.remove();

        let data = JSON.parse(reader.result);

        for (let key in data) {
          console.log(`localStorage ${key} = ${data[key]}`);
          window.localStorage.setItem(key, data[key]);
        }

        // make settings & widgets import reactive
        Object.assign(this.settings.$state, JSON.parse(data.settings));
        Object.assign(this.widgets.$state, JSON.parse(data.widgets));

        setNotification({
          message: "Settings have been restored.",
          type: "success",
          showIcon: false,
          dismiss: {
            manually: true,
            automatically: true,
          },
          appearance: "dark",
        });
      });

      input.setAttribute("type", "file");

      input.click();

      input.addEventListener("change", () => {
        console.log("File changed, read file");
        reader.readAsText(input.files[0]);
      });
    },
    userLogout() {
      request("/auth/logout", {
        method: "POST"
      }, (err, result) => {
        if (err || !result?.success) {

          setNotification({
            message: "Error: " + (err || "Unsuccessful request"),
            type: "danger",
            showIcon: false,
            dismiss: {
              manually: true,
              automatically: true,
            },
            appearance: "dark",
          });

        } else {

          console.log("/auth/logout", err || result)

          window.localStorage.removeItem("x-auth-token");
          window.sessionStorage.removeItem("authenticated");

          setNotification({
            message: "You haven been logged out",
            type: "success",
            showIcon: false,
            dismiss: {
              manually: true,
              automatically: true,
            },
            appearance: "dark",
          });

          setTimeout(() => {
            this.common.navbar = false;
            this.common.authenticated = false;
            router.push({
              path: "/auth/login",
            });
          }, 3000);

        }
      })
    },
    askForPermission(feature) {

      // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia?retiredLocale=de
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      if (feature === "notifications") {
        if (this.settings.permissionsNotifications) {

          Notification.requestPermission().then((granted) => {

            this.settings.permissionsNotifications = granted === "granted";

            if (this.settings.permissionsNotifications) {
              new Notification("Hi there!");
            }

          }).catch((err) => {
            console.error("Could not get notifications premission!", err);
          });

        }
      }/* else if (feature === "camera") {
        if (settings.permissionsCamera) {

          navigator.getUserMedia({
            video: true
          }, (stream) => {

            settings.permissionsCamera = true;

          }, (err) => {

            settings.permissionsCamera = false;

          });

        }
      }*/

    }
  },
});
</script>

<template>
  <div class="container-fluid">
    <!-- HEADER -->
    <div class="row py-4" style="border-top: 1px solid #000; border-bottom: 1px solid #000">
      <div class="col">
        <h3 class="mb-0">Settings</h3>
        Version: v{{ version }}
      </div>
    </div>
    <!-- HEADER -->
    <div class="row justify-content-start">
      <!-- ITEM GROUPING -->
      <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2 p-0">
        <div class="card bg-transparent">
          <div class="card-body">
            <h5 class="card-title">Item Grouping</h5>

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="groupItemsCheckbox" v-model="settings.groupItems" />
              <label class="form-check-label small" for="groupItemsCheckbox">
                Group Items
              </label>
            </div>

            <hr />

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="groupItemsRoomCheckbox"
                v-model="settings.groupRoomItems" :disabled="!settings.groupItems" />
              <label class="form-check-label small" for="groupItemsRoomCheckbox">
                Group Room Items
              </label>
            </div>

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="groupItemsEndpointCheckbox"
                v-model="settings.groupEndpointItems" :disabled="!settings.groupItems" />
              <label class="form-check-label small" for="groupItemsEndpointCheckbox">
                Group Endpoint Items
              </label>
            </div>

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="groupItemsDeviceCheckbox"
                v-model="settings.groupDeviceItems" :disabled="!settings.groupItems" />
              <label class="form-check-label small" for="groupItemsDeviceCheckbox">
                Group Device Items
              </label>
            </div>
          </div>
        </div>
      </div>
      <!-- ITEM GROUPING -->

      <!-- NAVIGATION -->
      <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2 p-0">
        <div class="card bg-transparent">
          <div class="card-body">
            <h5 class="card-title">Navigation</h5>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showSettingsButtonCheckbox"
                v-on:click="showSettingsButtonInfo()" v-model="settings.showSettingsButton" />
              <label class="form-check-label small" for="showSettingsButtonCheckbox">
                Show Settings buttons
              </label>
            </div>

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showBackButtonCheckbox"
                v-model="settings.showBackButton" />
              <label class="form-check-label small" for="showBackButtonCheckbox">
                Show Back button
              </label>
            </div>

            <hr />

            <div class="form-check form-switch" v-bind:key="route.path" v-for="route in routes">
              <input class="form-check-input" type="checkbox" :id="'show' + route.name + 'ButtonCheck'"
                v-model="settings['show' + route.name + 'Button']" />
              <label class="form-check-label small" :for="'show' + route.name + 'ButtonCheck'">
                Show {{ route.name }} button
              </label>
            </div>
          </div>
        </div>
      </div>
      <!-- NAVIGATION -->

      <!-- WIDGETS -->
      <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2 p-0">
        <div class="card bg-transparent">
          <div class="card-body">
            <h5 class="card-title">Widgets</h5>

            <!-- CARD CONTENT -->
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="editDashboardWidgetsCheckbox"
                v-model="settings.editDashboardWidgets" />
              <label class="form-check-label small" for="editDashboardWidgetsCheckbox">
                Unlock Dashboard widgets
              </label>
            </div>

            <div class="form-check form-switch">
              <label for="dashboardGridColsInput" class="form-label">Cols</label>
              <input type="number" id="dashboardGridColsInput" class="form-control bg-dark text-white"
                v-model="settings.dashboardGrid.cols" :disabled="!settings.editDashboardWidgets" />
            </div>

            <div class="form-check form-switch">
              <label for="dashboardGridRowsInput" class="form-label">Rows</label>
              <input type="number" id="dashboardGridRowsInput" class="form-control bg-dark text-white"
                v-model="settings.dashboardGrid.rows" :disabled="!settings.editDashboardWidgets" />
            </div>

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showDashboardWidgetsCheckbox"
                v-model="settings.showDashboardWidgets" :disabled="!settings.editDashboardWidgets" />
              <label class="form-check-label small" for="showDashboardWidgetsCheckbox">
                Show Dashboard widgets
              </label>
            </div>

            <hr />

            <div class="btn-group d-block">
              <button type="button" class="btn btn-primary dropdown-toggle w-100" data-bs-toggle="dropdown"
                aria-expanded="false" :disabled="!settings.editDashboardWidgets">
                Add Widget
              </button>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li v-bind:key="index" v-for="(widget, index) in Widget.components">
                  <button class="dropdown-item d-flex gap-2 align-items-center"
                    @click="addDashboardWidget(widget.name)">
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
      <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2 p-0 hide">
        <div class="card bg-transparent">
          <div class="card-body">
            <h5 class="card-title">Screensaver</h5>
            <!-- CONTENT -->
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="enableScreenSaverOverlayCheckbox"
                v-model="settings.enableScreenSaverOverlay" />
              <label class="form-check-label small" for="enableScreenSaverOverlayCheckbox">
                Screensaver overlay
              </label>
            </div>

            <div class="form-check form-switch">
              <label for="screenSaverOVerlayInput" class="form-label">
                Timeout in Sec.
              </label>
              <input type="number" id="screenSaverOVerlayInput" class="form-control bg-dark text-white"
                v-model="settings.screensaverOverlayDelay" :disabled="!settings.enableScreenSaverOverlay" />
              <input type="range" class="form-range" v-model="settings.screensaverOverlayDelay" min="10" max="60"
                step="10" :disabled="!settings.enableScreenSaverOverlay" />
            </div>

            <!-- CONTENT -->
          </div>
        </div>
      </div>
      <!-- SCREENSAVER -->

      <!-- LOOK & FEEL -->
      <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2 p-0">
        <div class="card bg-transparent">
          <div class="card-body">
            <h5 class="card-title">Look & Feel</h5>
            <!-- CONTENT -->
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showGradientBackgroundCheckbox"
                v-model="settings.showGradientBackground" />
              <label class="form-check-label small" for="showGradientBackgroundCheckbox">
                Enable Background gardient
              </label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="transparentDashboardWidgetsCheckbox"
                v-model="settings.transparentDashboardWidgets" />
              <label class="form-check-label small" for="transparentDashboardWidgetsCheckbox">
                Transparent Dashboard Widgets
              </label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="jumpToOnlyEndpointSetCheckbox"
                v-model="settings.jumpToOnlyEndpointSet" />
              <label class="form-check-label small" for="jumpToOnlyEndpointSetCheckbox">
                Jump to only Endpoint set from Device
              </label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showParameterInCommandsCheckbox"
                v-model="settings.showParameterInCommands" />
              <label class="form-check-label small" for="showParameterInCommandsCheckbox">
                Show/Handle command params in command box
              </label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showCommandStatesCounterCheckbox"
                v-model="settings.showCommandStatesCounter" />
              <label class="form-check-label small" for="showCommandStatesCounterCheckbox">
                Show command/states counter
              </label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showOverlayForConnectionLost"
                v-model="settings.showOverlayForConnectionLost" />
              <label class="form-check-label small" for="showOverlayForConnectionLost">
                Display Overlay when connection is lost
              </label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showUpdateTimestampInStates"
                v-model="settings.showUpdateTimestampInStates" />
              <label class="form-check-label small" for="showUpdateTimestampInStates">
                Show formatted update timestamp in states
              </label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="enableAnimationOnStateUpdate"
                v-model="settings.enableAnimationOnStateUpdate" />
              <label class="form-check-label small" for="enableAnimationOnStateUpdate">
                Enable animation on state update
              </label>
            </div>

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="useRemoteLayoutPages"
                v-model="settings.useRemoteLayoutPages" />
              <label class="form-check-label small" for="useRemoteLayoutPages">
                Use/Display command layout pages when available
              </label>
            </div>

            <!-- CONTENT -->
          </div>
        </div>
      </div>
      <!-- LOOK & FEEL -->

      <!-- MISCELLANEOUS -->
      <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2 p-0">
        <div class="card bg-transparent">
          <div class="card-body">
            <h5 class="card-title">Miscellaneous</h5>
            <!-- CONTENT -->

            <div class="form-check form-switch hide">
              <input class="form-check-input" type="checkbox" id="showVueTourOnNextVisitCheckbox"
                v-model="settings.showVueTourOnNextVisit" />
              <label class="form-check-label small" for="showVueTourOnNextVisitCheckbox">
                Enable Tour on next visit
              </label>
            </div>

            <button class="btn btn-outline-primary d-block w-100 mb-1" @click="toggleFullscreen()">
              Toggle fullscreen
            </button>

            <button class="btn btn-outline-primary d-block w-100 mb-1" @click="userLogout()">
              Logout
            </button>

            <a class="btn btn-outline-primary d-block w-100 mb-1" :href="settings.urls.adminUi">
              Administration
            </a>
            <!-- CONTENT -->
          </div>
        </div>
      </div>
      <!-- MISCELLANEOUS -->

      <!-- SETTINGS -->
      <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2 p-0">
        <div class="card bg-transparent">
          <div class="card-body">
            <h5 class="card-title">Settings</h5>
            <!-- CONTENT -->

            <button class="btn btn-outline-primary d-block w-100 mb-1" @click="exportSettings()">
              Export Settings
            </button>

            <button class="btn btn-outline-primary d-block w-100 mb-1" @click="importSettings()">
              Import Settings
            </button>

            <button class="btn btn-outline-primary d-block w-100" @click="clearSettings()">
              Clear Settings
            </button>

            <!-- CONTENT -->
          </div>
        </div>
      </div>
      <!-- SETTINGS -->

      <!-- PERMISSIONS -->
      <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2 p-0 hide">
        <div class="card bg-transparent">
          <div class="card-body">
            <h5 class="card-title">Permissions</h5>
            <!-- CONTENT -->

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="permissionsNotifications"
                v-model="settings.permissionsNotifications" v-on:change="askForPermission('notifications')" />
              <label class="form-check-label small" for="permissionsNotifications">
                Notifications
              </label>
            </div>

            <!--
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="permissionsPushNotifications"
                v-model="settings.permissionsPushNotifications" v-on:change="askForPermission('pushNotifications')" />
              <label class="form-check-label small" for="permissionsPushNotifications">
                Push Notification
              </label>
            </div>
            
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="permissionsCamera" v-model="settings.permissionsCamera"
                v-on:change="askForPermission('camera')" />
              <label class="form-check-label small" for="permissionsCamera">
                Camera
              </label>
            </div>
            -->

            <!-- CONTENT -->
          </div>
        </div>
      </div>
      <!-- PERMISSIONS -->

      <!-- INFORMATION -->
      <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2 p-0 hide">
        <div class="card bg-transparent">
          <div class="card-body">
            <h5 class="card-title">Information</h5>
            <!-- CONTENT -->

            <div clasS="d-block">
              Backend: vX.X.X
            </div>
            <div class="d-block">
              Frontend: vX.X.X
            </div>
            <div class="d-block">
              Connector: vX.X.X
            </div>
            <div class="d-block">
              Database: vX.X.X
            </div>

            <!-- CONTENT -->
          </div>
        </div>
      </div>
      <!-- INFORMATION -->

    </div>
  </div>
</template>

<style scoped>
.col-2 {
  margin-bottom: var(--bs-gutter-x);
}

div.card {
  min-height: 100%;
}

.card {
  border-color: #000;
}

.card-body,
.card {
  border-radius: 0;
}
</style>
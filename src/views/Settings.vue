<script>
import { defineComponent } from "vue";
import { toggleFullscreen, request, openDatabase, canInstallAsPwa, canUseFullscreen } from "../helper.js";
import { version } from "../../package.json";
import Widget, { widgetComponents } from "../components/Widget.vue";
import router, { routes } from "../router/index.js";
import { settingsStore, widgetStore, commonStore, userStore } from "../store.js";
import ResizableGrid from "../components/ResizableGrid.vue";

import { addNotification } from "../components/Notifications.vue";
import Panel from "../components/Panel.vue";
import Card from "../components/Card.vue";

export default defineComponent({
  components: {
    Panel,
    Card,
    ResizableGrid
  },
  setup() {

    const settings = settingsStore();
    const widgets = widgetStore();
    const common = commonStore();
    const user = userStore();

    return {
      settings,
      widgets,
      common,
      user,
      widgetComponents,
      canInstallAsPwa,
      canUseFullscreen
    };

  },
  data() {
    return {
      //widgets: Widget.components,
      Widget,
      version,
      routes,
      router,
      dateformats: [
        "yyyy.mm.dd - HH:MM",
        "yyyy.mm.dd - HH:MM:ss",
        "yyyy.mm.dd - HH:MM:ss.l",
        "dd.mm.yyyy - HH:MM",
        "dd.mm.yyyy - HH:MM:ss",
        "dd.mm.yyyy - HH:MM:ss.l"
      ],
      //showInstallButton: false,
      itemSizes: [
        { class: "col-6 col-md-3 col-xl-2", items: 6 },
        { class: "col-8 col-md-2 col-xl-4", items: 6 },
      ],
      itemWidth: 0,
      columns: 0,
      imageUrl: null,
      pin: {
        show: false,
        showContent: false,
        values: ["", "", "", ""],
        isWrong: false
      },
      panels: [
        "itemGrouping",
        "navigation",
        "widgets",
        "lookAndFeel",
        "miscellaneous",
        "settings",
        "permissions",
        "layout",
        "startpage",
        "background",
        "pin",
        "screensaver"
      ].map((slot) => {
        return {
          _id: slot,
          slot
        };
      })
    };
  },
  beforeMount() {
    // moved from mounted hook, here into "beforeMount"
    // otherwise its visible that there is "something" flickering/durchblitzen
    // the enter pin section is visible for a very short time
    this.pin.showContent = !this.settings.pin.enabled || this.settings.pin.value == "";
  },
  async mounted() {

    this.showInstallButton = !!window.deferredPrompt;
    this.itemWidth = this.settings.layout.itemSize;
    this.columns = this.settings.layout.columns;

    window.addEventListener('appinstalled', () => {

      this.showInstallButton = false;

      addNotification("<b>OpenHaus as PWA installed</b>", {
        type: "primary",
        dismiss: false
      });


    });

    const db = await openDatabase();

    const file = await new Promise((resolve, reject) => {

      const tx = db.transaction("images", "readonly");
      const store = tx.objectStore("images");

      const request = store.get("background");

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);

    });

    if (file) {
      if (this.imageUrl) URL.revokeObjectURL(this.imageUrl)
      this.imageUrl = URL.createObjectURL(file)
    }

    if (this.settings.pin.value != "") {
      this.pin.values = this.settings.pin.value.split("");
      this.$refs?.pin5?.focus();
    }

    // save changes that are made
    /*
    // TODO: Remove, see #42
    watch(this.settings, () => {
      if (!this.settings.groupItems) {
        this.settings.groupRoomItems = false;
        this.settings.groupEndpointItems = false;
        this.settings.groupDeviceItems = false;installApp
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

  /*
  computed: {
    bgStyle() {
      return {
        backgroundImage: this.imageUrl ? `url(${this.imageUrl})` : 'none',
        backgroundColor: this.imageUrl ? 'transparent' : '#e9ecef'
      }
    }
  },
  */
  computed: {
    showInstallButton() {
      return !!window.deferredPrompt.value;
    },
    paddingStyle() {
      return {
        "padding-top": `${this.settings.layout.gap}px`,
        "padding-left": `${this.settings.layout.gap}px`,
        "padding-right": `${this.settings.layout.gap}px`
      }
    }
  },
  methods: {
    toggleFullscreen,
    showSettingsButtonInfo() {
      /*
      nextTick(() => {
        if (this.settings.showSettingsButton) {
          addNotification({
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

      addNotification(`Widget "${widget}" added to Dashboard`, {
        type: "primary",
        dismiss: 3000
      });

    },
    async clearSettings() {
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

      addNotification("Local storage has been cleaned", {
        type: "primary",
        dismiss: 3000
      });

      this.user.logout();

      setTimeout(() => {
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

      addNotification(`Settings have been downloaded as "settings.json"`, {
        type: "primary",
        dismiss: 3000
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

        addNotification("Settings have been restored.", {
          type: "primary",
          dismiss: 3000
        });

      });

      input.setAttribute("type", "file");

      input.click();

      input.addEventListener("change", () => {
        console.log("File changed, read file");
        reader.readAsText(input.files[0]);
      });
    },
    async userLogout() {

      if (await this.user.logout()) {

        addNotification("You haven been logged out", {
          type: "primary",
          dismiss: 3000
        });

        setTimeout(() => {

          this.common.navbar = false;

          router.replace({
            path: "/auth/login",
          });

        }, 3000);

      } else {

        addNotification("Could not logout!", {
          type: "danger",
          dismiss: false
        });

      }

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

            console.log("Show nativ Notification", this.settings.permissionsNotifications)

            let obj = {
              type: "primary",
              dismiss: false
            };

            addNotification("This is a Test", obj);

            if (this.settings.permissionsNotifications) {

              let notification = new Notification("OpenHaus", {
                body: "This is a Test",
                icon: "/favicon.png",
                requireInteraction: false,
                silent: false
              });

              notification.addEventListener("show", () => {
                console.log("✅ Notification shown");
              });

              notification.addEventListener("error", (err) => {

                console.error("❌ Notification error:", err);

                addNotification(`Permission granted, but a error occurd. <br />Cant use native Notifications! <br />Fallback to in App notifications, disabled!`, {
                  ...obj,
                  type: "danger"
                });

                // disable permissions on error
                // to fallback to in app notifications
                setTimeout(() => {
                  this.settings.permissionsNotifications = false;
                }, 10);

              });

            } else {

              addNotification("Permission not granted, use in app fallback!", {
                ...obj,
                type: "warning"
              });

            }

            console.log("Permission for Notifications", granted);

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

    },
    async installApp() {

      const prompt = window.deferredPrompt.value;
      if (!prompt) return;

      prompt.prompt();
      const { outcome } = await prompt.userChoice;

      if (outcome === "dismissed") {

        addNotification('<b>OpenHaus not as PWA installed</b><br />You need to click "Install"', {
          type: "warning",
          dismiss: false
        });

      } else {

        window.deferredPrompt.value = null;
        this.showInstallButton = false;

      }

    },
    changeItemSizeRatio({ target }) {

      console.log("Change event", target.value);

      //settings.layout.itemClasses = this.itemSizes[target.value];
      settings.layout.itemSize = target.value;

    },
    async onFileChange(event) {

      const file = event.target.files[0];
      if (!file) return;
      if (this.imageUrl) URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = URL.createObjectURL(file);

      const elem = document.getElementById("app");

      elem.style.backgroundImage = `url(${this.imageUrl})`;
      elem.style.backgroundSize = "cover";
      elem.style.backgroundPosition = "center";
      elem.style.backgroundAttachment = "fixed";

      this.settings.showGradientBackground = false;

      // save background image in IndexDB
      const db = await openDatabase();
      const tx = db.transaction("images", "readwrite");
      const store = tx.objectStore("images");
      return await store.put(file, "background");

    },
    async resetImage() {

      if (this.imageUrl) URL.revokeObjectURL(this.imageUrl)
      this.imageUrl = null;


      const elem = document.getElementById("app");
      elem.classList.add("bg-dark")

      elem.style.backgroundImage = "";
      elem.style.backgroundSize = "";
      elem.style.backgroundPosition = "";
      elem.style.backgroundAttachment = "";

      this.settings.showGradientBackground = true;
      this.settings.layout.itemTransparancy = 0;

      document.documentElement.style.setProperty("--item-alpha", 0);

      const db = await openDatabase();

      await new Promise((resolve, reject) => {

        const tx = db.transaction("images", "readwrite");
        const store = tx.objectStore("images");

        store.delete("background");

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);

      });

    },
    changeItemTransparancy({ target }) {
      document.documentElement.style.setProperty("--item-alpha", target.value / 100);
    },
    pinInput(event, index) {
      if (new RegExp('^[0-9]$').test(event.data) && event.inputType === "insertText") {
        // removed, because we dont jump from end, to start
        // so this function can be resused, for setting pin
        // and confimration when settings page is visit 
        // with ref's "pin5", "pin6", "ping7", "pin8"
        //if (index < this.pin.values.length) {

        // set focus on next input field
        this.$refs[`pin${index + 1}`].focus();

        //}
      } else {

        // clear input, not a valid number/integer
        this.$refs[`pin${index}`].value = "";

      }
    },
    savePin() {

      if (this.pin.values.some((v) => v === "")) {
        return addNotification("<h6>Please enter PIN!</h6>Enter your pin below to secure the settings page!", {
          type: "danger",
          dismiss: false
        });
      }

      addNotification(`<h6>PIN saved!</h6>Next "Settings" page visit, you need to enter the PIN!`, {
        type: "success",
        dismiss: false
      });

      this.settings.pin.value = [
        this.$refs.pin1.value,
        this.$refs.pin2.value,
        this.$refs.pin3.value,
        this.$refs.pin4.value,
      ].join("");

    },
    clearPin() {

      addNotification("<h6>PIN cleard!</h6>No PIN needed anymore!", {
        type: "success",
        dismiss: false
      });

      this.settings.pin.value = "";
      this.settings.pin.enabled = false;
      this.pin.values = ["", "", "", ""];

    },
    checkPinInput() {

      let fields = [
        this.$refs.pin5,
        this.$refs.pin6,
        this.$refs.pin7,
        this.$refs.pin8
      ];

      if (fields.map(el => el.value).join("") == this.settings.pin.value) {

        // pin correct, show secret content
        this.pin.showContent = true;

      } else {

        this.$refs.pin5.focus();
        this.pin.isWrong = true;

        setTimeout(() => {
          this.pin.isWrong = false;
        }, 500);

        fields.forEach((el) => {
          el.value = "";
        });


      }

    }
  },
  beforeUnmount() {
    if (this.imageUrl) URL.revokeObjectURL(this.imageUrl)
  }
});
</script>

<template>
  <div class="container-fluid" v-if="pin.showContent">

    <!-- HEADER -->
    <div class="row">
      <Card class="w-100" :style="paddingStyle">

        <h3 class="mb-0">Settings</h3>
        Version: v{{ version }}

      </Card>
    </div>
    <!-- HEADER -->

    <div class="row justify-content-start">
      <ResizableGrid :items="panels">

        <!-- ITEM GROUPING -->
        <template #itemGrouping>
          <Panel title="Item Grouping" class="w-100">

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

          </Panel>
        </template>
        <!-- ITEM GROUPING -->

        <!-- NAVIGATION -->
        <template #navigation>
          <Panel title="Navigation" class="w-100">

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showSettingsButtonCheckbox"
                v-on:click="showSettingsButtonInfo()" v-model="settings.navigation.showSettingsButton" />
              <label class="form-check-label small" for="showSettingsButtonCheckbox">
                Show Settings buttons
              </label>
            </div>

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showBackButtonCheckbox"
                v-model="settings.navigation.showBackButton" />
              <label class="form-check-label small" for="showBackButtonCheckbox">
                Show Back button
              </label>
            </div>

            <hr />

            <div class="form-check form-switch" v-bind:key="route.path" v-for="route in routes">
              <input class="form-check-input" type="checkbox" :id="'show' + route.name + 'ButtonCheck'"
                v-model="settings.navigation['show' + route.name + 'Button']" />
              <label class="form-check-label small" :for="'show' + route.name + 'ButtonCheck'">
                Show {{ route.name }} button
              </label>
            </div>

          </Panel>
        </template>
        <!-- NAVIGATION -->

        <!-- WIDGETS -->
        <template #widgets>
          <Panel title="Widgets" class="w-100">

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
                v-model="settings.showDashboardWidgets" />
              <label class="form-check-label small" for="showDashboardWidgetsCheckbox">
                Show Dashboard widgets
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
              <input class="form-check-input" type="checkbox" id="widgetsApplyLayoutGap"
                v-model="settings.widgetsApplyLayoutStyling" />
              <label class="form-check-label small" for="widgetsApplyLayoutGap">
                Apply Layout Styling
              </label>
            </div>

            <!--
            Does currently not work
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showWidgetTitleBarCheckbox"
                v-model="settings.showWidgetTitleBar" :disabled="!settings.showWidgetTitleBar" />
              <label class="form-check-label small" for="showWidgetTitleBarCheckbox">
                Display Widget Title Bar
              </label>
            </div>
            -->

            <hr />

            <div class="btn-group d-block">
              <button type="button" class="btn btn-primary dropdown-toggle w-100" data-bs-toggle="dropdown"
                aria-expanded="false" :disabled="!settings.editDashboardWidgets">
                Add Widget
              </button>
              <ul class="dropdown-menu dropdown-menu-dark w-100">
                <li v-bind:key="index" v-for="(widget, index) in widgetComponents">
                  <button class="dropdown-item d-flex gap-2 align-items-center"
                    @click="addDashboardWidget(widget.name)">
                    {{ widget.name }}
                  </button>
                </li>
              </ul>
            </div>

          </Panel>
        </template>
        <!-- WIDGETS -->

        <!-- LOOK & FEEL -->
        <template #lookAndFeel>
          <Panel title="Look & Feel" class="w-100">

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

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="repeatCommand" v-model="settings.repeatCommand" />
              <label class="form-check-label small" for="repeatCommand">
                Repeat command when hold pressed
              </label>
            </div>

          </Panel>
        </template>
        <!-- LOOK & FEEL -->

        <!-- MISCELLANEOUS -->
        <template #miscellaneous>
          <Panel title="Miscellaneous" class="w-100">

            <div class="form-check form-switch hide">
              <input class="form-check-input" type="checkbox" id="showVueTourOnNextVisitCheckbox"
                v-model="settings.showVueTourOnNextVisit" />
              <label class="form-check-label small" for="showVueTourOnNextVisitCheckbox">
                Enable Tour on next visit
              </label>
            </div>

            <button class="btn btn-outline-primary d-block w-100 mb-1" @click="toggleFullscreen()"
              v-if="canUseFullscreen()">
              Toggle fullscreen
            </button>

            <button class="btn btn-outline-primary d-block w-100 mb-1" @click="userLogout()">
              Logout
            </button>

            <a class="btn btn-outline-primary d-block w-100 mb-1" :href="settings.urls.adminUi" v-if="user.isAdmin"
              target="_blank">
              Administration
            </a>

            <hr>

            Dateformat

            <select class="form-select bg-transparent text-white border-primary" v-model="settings.dateformat">
              <option v-for="format in dateformats">
                {{ format }}
              </option>
            </select>

            <hr v-if="user.isAdmin" class="hide" />

            <div class="form-check form-switch hide" v-if="user.isAdmin">
              <input class="form-check-input" type="checkbox" id="showNotifications"
                v-model="settings.showNotifications" />
              <label class="form-check-label small" for="showNotifications">
                Show System Notifications
              </label>
            </div>

            <div class="form-check form-switch hide" v-if="user.isAdmin">
              <input class="form-check-input" type="checkbox" id="sendSystemNotifications"
                v-model="settings.sendSystemNotifications" />
              <label class="form-check-label small" for="sendSystemNotifications">
                Send System Notifications
              </label>
            </div>

            <hr v-if="canInstallAsPwa()" />

            <button class="btn btn-outline-primary d-block w-100 mb-1" @click="installApp()"
              :disabled="!showInstallButton" v-if="canInstallAsPwa()">
              Install as PWA
            </button>

          </Panel>
        </template>
        <!-- MISCELLANEOUS -->

        <!-- SETTINGS -->
        <template #settings>
          <Panel title="Settings" class="w-100">

            <button class="btn btn-outline-primary d-block w-100 mb-1" @click="exportSettings()">
              Export Settings
            </button>

            <button class="btn btn-outline-primary d-block w-100 mb-1" @click="importSettings()">
              Import Settings
            </button>

            <button class="btn btn-outline-danger d-block w-100" @click="clearSettings()">
              Clear Settings
            </button>

          </Panel>
        </template>
        <!-- SETTINGS -->

        <!-- PERMISSIONS -->
        <template #permissions>
          <Panel title="Permissions" class="w-100">

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="permissionsNotifications"
                v-model="settings.permissionsNotifications" v-on:change="askForPermission('notifications')" />
              <label class="form-check-label small" for="permissionsNotifications">
                Notifications
              </label>
            </div>

          </Panel>
        </template>
        <!-- PERMISSIONS -->

        <!-- LAYOUT -->
        <template #layout>
          <Panel title="Layout" class="w-100">

            <div class="mb-3">
              <label class="form-label mb-0">Gap between items</label>
              <input type="range" class="form-range" min="0" step="5" max="25" v-model="settings.layout.gap">

              <div class="d-flex justify-content-between px-1" style="margin-top: -10px;">
                <span v-for="val in [0, 5, 10, 15, 20, 25]" :key="val" style="font-size: 8px; color: #000">|</span>
              </div>

              {{ settings.layout.gap }}px

            </div>

            <div class="mb-3">
              <label class="form-label mb-0">Item border radius</label>
              <input type="range" class="form-range" min="0" step="5" max="30" v-model="settings.layout.borderRadius">

              <div class="d-flex justify-content-between px-1" style="margin-top: -10px;">
                <span v-for="val in [0, 5, 10, 15, 20, 25, 30]" :key="val" style="font-size: 8px; color: #000">|</span>
              </div>

              {{ settings.layout.borderRadius }}px

            </div>

            <div class="mb-3">

              <label class="form-label mb-0">Item Opacity</label>
              <input type="range" class="form-range" min="0" step="1" max="100"
                v-model="settings.layout.itemTransparancy" @input="changeItemTransparancy($event)">

              {{ settings.layout.itemTransparancy }}%

            </div>

            <div class="mb-3">
              <label class="form-label mb-0">Item min width</label>

              <input type="range" class="form-range" min="100" step="10" max="1000" v-model="itemWidth"
                @change="($event) => { settings.layout.itemSize = $event.target.value }">

              {{ itemWidth }}px

            </div>

            <div>

              <label class="form-label mb-0">Colums</label>
              <input type="range" class="form-range" min="1" step="1" max="12" v-model="columns"
                @change="($event) => { settings.layout.columns = $event.target.value }">

              <div class="d-flex justify-content-between px-1" style="margin-top: -10px;">
                <span v-for="val in Array.from({ length: 12 })" :key="val" style="font-size: 8px; color: #000">|</span>
              </div>

              {{ columns }}

            </div>

          </Panel>
        </template>
        <!-- LAYOUT -->

        <!-- STARTPAGE -->
        <template #startpage>
          <Panel title="Startpage" class="w-100">

            <select class="form-select btn btn-outline-primary d-block w-100 mb-1" v-model="settings.startpage">
              <option v-for="route in routes" :value="route.path">
                {{ route.name }}
              </option>
            </select>

            <button class="btn btn-outline-secondary w-100" @click="router.push(settings.startpage)">
              Naviagte to page
            </button>

          </Panel>
        </template>
        <!-- STARTPAGE -->

        <!-- BACKGROUND -->
        <template #background>
          <Panel title="Background" class="w-100">

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showGradientBackgroundCheckbox"
                v-model="settings.showGradientBackground" :disabled="this.imageUrl" />
              <label class="form-check-label small" for="showGradientBackgroundCheckbox">
                Enable Background gardient
              </label>
            </div>

            <div class="mb-3 mt-3">
              <label for="bgUpload" class="form-label hide">Hintergrundbild wählen</label>
              <input type="file" id="bgUpload" class="form-control hide" accept="image/*" @change="onFileChange"
                ref="bgUpload">
              <button class="btn btn-outline-primary w-100" @click="$refs.bgUpload.click()"> Upload/Select </button>
            </div>

            <button v-if="imageUrl" class="btn btn-outline-secondary w-100" @click="resetImage()">
              Reset/Delete
            </button>

          </Panel>
        </template>
        <!-- BACKGROUND -->

        <!-- PIN -->
        <template #pin>
          <Panel title="PIN" class="w-100">

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="enablePIN" v-model="settings.pin.enabled" />
              <label class="form-check-label small" for="enablePIN">
                Secure Settings page with PIN
              </label>
            </div>

            <div class="d-flex justify-content-center mt-3">
              <input :type="pin.show ? 'text' : 'password'" class="form-control bg-dark text-primary text-center"
                placeholder="•" maxlength="1" ref="pin1" @input="pinInput($event, 1)" :disabled="!settings.pin.enabled"
                pattern="\d{1}" v-model="pin.values[0]" @focus="$event.target.select()">
              <span class="m-2">•</span>
              <input :type="pin.show ? 'text' : 'password'" class="form-control bg-dark text-primary text-center"
                placeholder="•" maxlength="1" ref="pin2" @input="pinInput($event, 2)" :disabled="!settings.pin.enabled"
                pattern="\d{1}" v-model="pin.values[1]" @focus="$event.target.select()">
              <span class="m-2">•</span>
              <input :type="pin.show ? 'text' : 'password'" class="form-control bg-dark text-primary text-center"
                placeholder="•" maxlength="1" ref="pin3" @input="pinInput($event, 3)" :disabled="!settings.pin.enabled"
                pattern="\d{1}" v-model="pin.values[2]" @focus="$event.target.select()">
              <span class="m-2">•</span>
              <input :type="pin.show ? 'text' : 'password'" class="form-control bg-dark text-primary text-center"
                placeholder="•" maxlength="1" ref="pin4" @input="pinInput($event, 4)" :disabled="!settings.pin.enabled"
                pattern="\d{1}" v-model="pin.values[3]" @focus="$event.target.select()">
            </div>

            <button class="btn btn-outline-primary mt-3 w-100" @mousedown="pin.show = true" @mouseup="pin.show = false"
              @mouseleave="pin.show = false" @touchstart="pin.show = true" @touchend="pin.show = false"
              @touchcancel="pin.show = false">
              <i class="fa-solid" :class="{ 'fa-eye': !pin.show, 'fa-eye-slash': pin.show }"></i> Show PIN
            </button>

            <button class="btn btn-outline-success mt-1 w-100" @click="savePin()">
              Save
            </button>

            <button class="btn btn-outline-warning mt-1 w-100" @click="clearPin()">
              Clear
            </button>

          </Panel>
        </template>
        <!-- PIN -->

        <!-- SCREENSAVER -->
        <template #screensaver>
          <Panel title="Screensaver" class="w-100">

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="enableScreenSaverOverlayCheckbox"
                v-model="settings.screensaver.enabled" />
              <label class="form-check-label small" for="enableScreenSaverOverlayCheckbox">
                Enable Screensaver
              </label>
            </div>

            <div class="form-check form-switch">
              <label for="screenSaverOVerlayInput" class="form-label">
                Timeout in Sec.
              </label>
              <input type="number" id="screenSaverOVerlayInput" class="form-control bg-dark text-white"
                v-model="settings.screensaver.timeout" :disabled="!settings.screensaver.enabled" />
            </div>

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="screensaveruseBlackBackground"
                v-model="settings.screensaver.blackBackground" :disabled="!settings.screensaver.enabled" />
              <label class="form-check-label small" for="screensaveruseBlackBackground">
                Black Background
              </label>
            </div>

          </Panel>
        </template>
        <!-- SCREENSAVER -->

        <!-- INFORMATION -->
        <template #information>
          <Panel title="Information" class="hide w-100">

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

          </Panel>
        </template>
        <!-- INFORMATION -->

      </ResizableGrid>
    </div>

  </div>
  <div class="container d-flex flex-column align-items-center justify-content-center min-vh-100" v-else>

    <h3>Please enter pin.</h3>
    <h5>Settings page is secured!</h5>

    <div class="d-flex justify-content-center" :class="{ shake: pin.isWrong }">
      <input type="password" class="form-control bg-dark text-primary text-center input-pin" placeholder="•"
        maxlength="1" ref="pin5" @input="pinInput($event, 5)" @focus="$event.target.select()"
        style="font-size:40px; width:60px;">
      <span style="font-size: 40px" class="m-2">•</span>
      <input type="password" class="form-control bg-dark text-primary text-center input-pin" placeholder="•"
        maxlength="1" ref="pin6" @input="pinInput($event, 6)" @focus="$event.target.select()"
        style="font-size:40px; width:60px;">
      <span style="font-size: 40px" class="m-2">•</span>
      <input type="password" class="form-control bg-dark text-primary text-center input-pin" placeholder="•"
        maxlength="1" ref="pin7" @input="pinInput($event, 7)" @focus="$event.target.select()"
        style="font-size:40px; width:60px;">
      <span style="font-size: 40px" class="m-2">•</span>
      <input type="password" class="form-control bg-dark text-primary text-center input-pin" placeholder="•"
        maxlength="1" ref="pin8" @input="checkPinInput()" @focus="$event.target.select()"
        style="font-size:40px; width:60px;">
    </div>

  </div>
</template>

<style scoped>
@keyframes shake {

  10%,
  90% {
    transform: translateX(-1px);
  }

  20%,
  80% {
    transform: translateX(2px);
  }

  30%,
  50%,
  70% {
    transform: translateX(-4px);
  }

  40%,
  60% {
    transform: translateX(4px);
  }
}

.shake {
  animation: shake 0.5s ease-in-out;
  border-color: #dc3545 !important;
}

.input-pin {
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  border-top: 1px solid #000;
}
</style>
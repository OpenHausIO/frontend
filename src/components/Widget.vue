<script>
import { defineComponent, reactive } from "vue";
import { settingsStore, widgetStore } from "../store.js";
import Modal from "./Modal.vue";

//export const components = reactive({});
export const widgetComponents = {};

const allowedWidgets = [
  "Clock",
  "Commands",
  "Countdown",
  "Counter",
  "Empty",
  "Notes",
  "Scenes",
  "States",
  "Stopwatch",
  "Todo",
  "WebView",
  //"Video"
];

(async () => {
  if (Object.values(widgetComponents).length === 0) {

    const modules = import.meta.glob("../widgets/*.vue", {
      eager: true
    });

    for (const [path, module] of Object.entries(modules)) {

      const fileName = path.split("/").pop().replace(".vue", "");
      if (!allowedWidgets.includes(fileName)) continue;

      const component = module.default;
      widgetComponents[component.name] = component;

    }

  }
})();


export default defineComponent({
  emits: ["loaded", "menu"],
  setup() {

    const settings = settingsStore();
    const store = widgetStore();

    return {
      settings,
      store,
      //components
    };

  },
  props: {
    name: {
      type: String,
      required: true,
    },
    menu: {
      type: Array,
      default: () => []
    },
    uuid: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    Modal
  },
  data() {
    return {
      childAction: "",
      showTextbox: false,
      //showTitlebox: true,
      showOptionsModal: false,
      showTitleboxCheckbox: true,
      title: ""
    };
  },
  mounted() {

    this.loadFromStorage();

    Object.keys(this.options).forEach((key) => {
      this[key] = this.options[key];
    });

  },
  methods: {
    remove(widget) {
      console.log("Remove", widget)
      this.store.remove(widget);
    },
    dispatchEvent(entry) {
      this.$emit("menu", entry);
    },
    editTitle() {
      this.showTextbox = !this.showTextbox;
      this.$nextTick(() => {
        console.log(this.$refs.title); // jetzt da
        this.$refs.title?.focus();
      });
    },
    openOptions() {
      this.showOptionsModal = true;
    },
    storageKey() {
      return `widget-${this.uuid}`;
    },
    loadFromStorage() {
      let parsed = null;

      try {
        const raw = localStorage.getItem(this.storageKey());
        if (raw) parsed = JSON.parse(raw);
      } catch (e) {
        console.warn("Konnte Widget-Daten nicht laden", e);
      }

      const { options = {}, data = {} } = parsed ?? {};

      if (options.title !== undefined) this.title = options.title;
      if (options.showTitleboxCheckbox !== undefined) {
        this.showTitleboxCheckbox = options.showTitleboxCheckbox;
      }

      this.$emit("loaded", data);
    },
    saveToStorage() {
      let existing = null;

      try {
        const raw = localStorage.getItem(this.storageKey());
        if (raw) existing = JSON.parse(raw);
      } catch (e) {
        console.warn("Konnte vorhandene Widget-Daten nicht lesen", e);
      }

      const { data: existingData = {}, options: existingOptions = {} } = existing ?? {};

      try {
        localStorage.setItem(this.storageKey(), JSON.stringify({
          data: {
            ...existingData,
            ...this.data
          },
          options: {
            ...existingOptions,
            title: this.title,
            showTitleboxCheckbox: this.showTitleboxCheckbox
          }
        }));
      } catch (e) {
        console.warn("Konnte Widget-Daten nicht speichern", e);
      }
    },
    clearWidgetStorage() {
      localStorage.removeItem(this.storageKey());
    }
  },
  watch: {
    data: {
      handler() {
        this.saveToStorage();
      },
      deep: true
    },
    title() {
      this.saveToStorage();
    },
    showTitleboxCheckbox() {
      this.saveToStorage();
    }
  },
  computed: {
    editTileTitle() {
      if (this.showTextbox) {
        return "Done editing";
      } else {
        return "Edit Title";
      }
    },
    showTitlebox() {
      return this.showTitleboxCheckbox || this.settings.editDashboardWidgets;
    }
  }
});
</script>

<template>
  <div class="h-100 w-100 d-flex flex-column" style="min-height: 0;">

    <Modal :visible="showOptionsModal" @close="showOptionsModal = false" :title="'Widget Options: ' + name">
      <template #body>

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">Title</label>
          <input type="email" class="form-control bg-transparent text-white" id="exampleFormControlInput1"
            v-model="title" placeholder="Shopping list">
        </div>

        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" :id="'dashboardWidget' + uuid"
            v-model="showTitleboxCheckbox" />
          <label class="form-check-label small" :for="'dashboardWidget' + uuid">
            Show Titlebar
          </label>
        </div>

        <slot name="options">

        </slot>

      </template>
      <template #footer>

        <!--<button type="button" class="btn btn-outline-danger pull-left" @click="clearWidgetStorage()">Clear</button>-->
        <button type="button" class="btn btn-outline-secondary" @click="showOptionsModal = false">Close</button>

      </template>
    </Modal>

    <!-- TITLEBAR -->
    <div class="d-flex align-items-center" style="height: 42px; border-bottom: 1px solid #000" v-if="showTitlebox">

      <!-- TITLE -->
      <slot name="title">
        <span class="text-white d-flex align-items-center flex-grow-1" style="font-size: 25px; min-width: 0">
          <span class="me-1">{{ name }}:</span>
          <input type="text" :value="title" v-if="showTextbox" ref_key="title" class="flex-grow-1"
            style="min-width: 0" />
          <span v-else class="text-truncate">{{ title }}</span>
        </span>
      </slot>
      <!-- TITLE -->

      <!-- HAMBURGER -->
      <div class="btn-group menu">
        <i class="fa-solid fa-ellipsis-vertical text-secondary px-1"
          style="cursor: pointer; width: 24px; text-align: center;" data-bs-toggle="dropdown" aria-expanded="false"></i>


        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
          <li v-for="(entry, index) in menu" :key="index">
            <button class="dropdown-item" @click="dispatchEvent(entry)">
              {{ entry.title }}
            </button>
          </li>
          <li v-if="menu.length > 0">
            <hr class="dropdown-divider" />
          </li>
          <li>
            <button class="dropdown-item" @click="openOptions()">
              Options
            </button>
          </li>
          <li v-if="settings.editDashboardWidgets">
            <button class="dropdown-item text-danger" @click="remove(this)">
              Remove
            </button>
          </li>
        </ul>
      </div>

    </div>
    <!-- TITLEBAR -->

    <!-- BODY -->
    <div class="flex-grow-1" style="overflow-y: auto; min-height: 0" :class="{ 'pt-3': showTitlebox }">
      <slot> </slot>
    </div>
    <!-- BODY -->

  </div>
</template>

<!-- 
TYPO!!!! Should be "scoped"
But, input/password fields look better with styling applied below.
Same in "Todo.vue"
-->
<style scope>
ul.dropdown-menu {
  z-index: 999 !important;
}

.widget {
  overflow-y: scroll;
}

div.menu>i {
  /*border: 1px solid #000;*/
  border-radius: 100%;
  min-height: 25px;
  min-width: 25px;
  line-height: 25px;
  margin-right: -10px;
}

input[type=text],
input[type=password] {
  border-color: var(--bs-primary);
}

/*
Draff/fix/implementation of #93
ul.dropdown-menu-dark {
  background-color: rgba(var(--bs-dark-rgb), var(--bs-bg-opacity));
}
*/

div.menu {
  touch-action: manipulation;
}
</style>
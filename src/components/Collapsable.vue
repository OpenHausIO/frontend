<script>
import { defineComponent } from "vue";
import Card from "../components/Card.vue";
import { useCollapsablesStore, settingsStore } from "../store.js";

export default defineComponent({
  name: "Collapsable",
  components: {
    Card
  },
  props: {
    collapsed: {
      default: false,
      type: Boolean,
    },
    name: {
      type: String,
      required: true
    },
  },
  setup() {

    const collapsablesStore = useCollapsablesStore();
    const settings = settingsStore();

    return {
      collapsablesStore,
      settings
    };

  },
  computed: {
    text() {
      return this.open ? "Expand" : "Collapse";
    },
    open: {
      get() {
        return this.collapsablesStore.getOpen(this.name, this.collapsed);
      },
      set(value) {
        this.collapsablesStore.setOpen(this.name, value);
      },
    },
    styling() {
      return {
        "padding": `0 ${this.settings.layout.gap}px`,
        "margin-top": `${this.settings.layout.gap}px`
      }
    }
  },
});
</script>

<template>
  <div class="w-100">

    <!-- HEADER -->
    <div class="row">
      <Card class="w-100" :style="styling">

        <div class="d-flex align-items-center justify-content-between">

          <!-- LEFT -->
          <div class="d-flex align-items-center flex-grow-1 min-width-0">
            <slot name="title" id="title"></slot>
          </div>
          <!-- LEFT -->

          <!-- RIGHT -->
          <div class="flex-shrink-0 ms-3 text-center" style="min-width: 4.5rem;" @click="open = !open">
            <div v-if="!open" class="text-center">
              <i class="fa-solid fa-chevron-up fa-2x d-block"></i>
              Collapse
            </div>
            <div v-else class="text-center">
              <i class="fa-solid fa-chevron-down fa-2x d-block"></i>
              Expand
            </div>
          </div>
          <!-- RIGHT -->

        </div>

      </Card>
    </div>
    <!-- HEADER -->

    <!-- CONTENT -->
    <div class="collapsible" :class="{ 'is-open': !open }">
      <div class="collapsible-inner row">
        <slot></slot>
      </div>
    </div>
    <!-- CONTENT -->

  </div>
</template>

<style scoped>
.collapsible {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease-in-out;
}

.collapsible.is-open {
  grid-template-rows: 1fr;
}

.collapsible-inner {
  overflow: hidden;
  min-height: 0;
}
</style>
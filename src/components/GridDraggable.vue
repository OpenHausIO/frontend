<template>
  <Grid :items="items" :cols="cols" :rows="rows" :showGrid="unlocked" ref="gridRef">
    <template #item="data">

      <div class="draggable" :class="{ 'dashed-border': unlocked, 'is-draggable': unlocked }"
        @mousedown="unlocked ? startDrag($event, data.index) : null"
        @touchstart="unlocked ? startDrag($event, data.index) : null">
        <Card class="h-100 w-100">

          <slot name="item" :item="data.item" :index="data.index" v-bind="data">
            Draggable Item #{{ data.index + 1 }}
          </slot>

          <div v-if="unlocked" class="resize-handle" @mousedown.stop="startResize($event, data.index)"
            @touchstart.stop="startResize($event, data.index)">
          </div>

        </Card>
      </div>

    </template>
  </Grid>
</template>

<script>
import { defineComponent } from "vue";
import Grid from "./Grid.vue";
import { settingsStore } from "../store.js";
import Card from "./Card.vue";
const settings = settingsStore();

export default defineComponent({
  name: "GridDraggable",
  components: {
    Card,
    Grid
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    cols: {
      type: Number,
      default: 5
    },
    rows: {
      type: Number,
      default: 5
    },
    unlocked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dragging: null,
      resizing: null,
      startX: 0,
      startY: 0,
      startColStart: 0,
      startRowStart: 0,
      startColSpan: 0,
      startRowSpan: 0,
      cellWidth: 0,
      cellHeight: 0
    }
  },
  methods: {
    startDrag(e, index) {
      if (!this.unlocked) return;

      if (e.target.closest(".menu") || e.target.closest(".dropdown-menu")) {
        return;
      }

      e.preventDefault();
      const item = this.items[index];

      const gridElement = this.$refs.gridRef.$el.querySelector(".grid");
      if (!gridElement) return;

      const rect = gridElement.getBoundingClientRect();
      this.cellWidth = rect.width / this.cols;
      this.cellHeight = rect.height / this.rows;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      this.startX = clientX;
      this.startY = clientY;
      this.startColStart = item.position.x;
      this.startRowStart = item.position.y;
      this.startColSpan = item.size.w;
      this.startRowSpan = item.size.h;

      this.dragging = index;

      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.stopDrag);
      document.addEventListener("touchmove", this.onDrag);
      document.addEventListener("touchend", this.stopDrag);
    },

    startResize(e, index) {
      if (!this.unlocked) return;

      e.preventDefault();
      e.stopPropagation();

      const item = this.items[index];

      const gridElement = this.$refs.gridRef.$el.querySelector(".grid");
      if (!gridElement) return;

      const rect = gridElement.getBoundingClientRect();
      this.cellWidth = rect.width / this.cols;
      this.cellHeight = rect.height / this.rows;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      this.startX = clientX;
      this.startY = clientY;
      this.startColStart = item.position.x;
      this.startRowStart = item.position.y;
      this.startColSpan = item.size.w;
      this.startRowSpan = item.size.h;

      this.resizing = index;

      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.stopDrag);
      document.addEventListener("touchmove", this.onDrag);
      document.addEventListener("touchend", this.stopDrag);
    },

    onDrag(e) {
      if (this.dragging === null && this.resizing === null) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - this.startX;
      const deltaY = clientY - this.startY;

      const colDelta = Math.round(deltaX / this.cellWidth);
      const rowDelta = Math.round(deltaY / this.cellHeight);

      if (this.dragging !== null) {
        const newColStart = Math.max(1, Math.min(this.cols - this.startColSpan + 1, this.startColStart + colDelta));
        const newRowStart = Math.max(1, Math.min(this.rows - this.startRowSpan + 1, this.startRowStart + rowDelta));

        this.$emit("update:position", {
          index: this.dragging,
          position: { x: newColStart, y: newRowStart }
        });
      } else if (this.resizing !== null) {
        const newColSpan = Math.max(1, Math.min(this.cols - this.startColStart + 1, this.startColSpan + colDelta));
        const newRowSpan = Math.max(1, Math.min(this.rows - this.startRowStart + 1, this.startRowSpan + rowDelta));

        this.$emit("update:size", {
          index: this.resizing,
          size: { w: newColSpan, h: newRowSpan }
        });
      }
    },

    stopDrag() {
      this.dragging = null;
      this.resizing = null;

      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.stopDrag);
      document.removeEventListener("touchmove", this.onDrag);
      document.removeEventListener("touchend", this.stopDrag);
    }
  },
  beforeUnmount() {
    document.removeEventListener("mousemove", this.onDrag);
    document.removeEventListener("mouseup", this.stopDrag);
    document.removeEventListener("touchmove", this.onDrag);
    document.removeEventListener("touchend", this.stopDrag);
  },
  computed: {
    gap() {
      if (settings.widgetsApplyLayoutStyling) {
        return Number(settings.layout.gap);
      }
    }
  }
});
</script>

<style scoped>
*::selection {
  background-color: transparent;
  user-select: none;
}

.draggable {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: none;
  position: relative;
}

.draggable.is-draggable {
  cursor: grab;
  background-color: rgba(0, 0, 0, 0.8)
}

.draggable.is-draggable:active {
  cursor: grabbing;
}

.dashed-border {
  border: 1px dashed var(--bs-blue);
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, transparent 50%, rgba(255, 255, 255, 0.3) 50%);
  cursor: nwse-resize !important;
  z-index: 10;
}

.resize-handle:hover {
  background: linear-gradient(135deg, transparent 50%, rgba(255, 255, 255, 0.5) 50%);
}

.dashed-border:hover {
  opacity: 0.9;
}
</style>
<template>
  <div class="draggable" :style="{
    left: `${x * gridSize}px`,
    top: `${y * gridSize}px`,
    width: `${width}px`,
    height: `${height}px`
  }" ref="draggable" @mousedown="startDrag">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "GridItem",
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      isDragging: false,
      offsetX: 0,
      offsetY: 0,
      gridSize: 100
    };
  },
  methods: {
    startDrag(e) {
      this.isDragging = true;
      this.offsetX = e.clientX - this.$refs.draggable.offsetLeft;
      this.offsetY = e.clientY - this.$refs.draggable.offsetTop;
      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.stopDrag);
    },
    onDrag(e) {
      if (this.isDragging) {
        const x = Math.round((e.clientX - this.offsetX) / this.gridSize);
        const y = Math.round((e.clientY - this.offsetY) / this.gridSize);

        this.$emit("update:x", x);
        this.$emit("update:y", y);
      }
    },
    stopDrag() {
      this.isDragging = false;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.stopDrag);
    }
  }
};
</script>

<style>
.draggable {
  position: absolute;
  background-color: red;
  cursor: grab;
  box-sizing: border-box;
}

.draggable:active {
  cursor: grabbing;
}
</style>

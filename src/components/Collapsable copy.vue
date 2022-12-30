<script>
export default {
  props: {
    collapsed: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    text() {
      return this.collapsed ? "Expand" : "Collapse";
    },
  },
};
</script>


<template>
  <div>
    <div class="row">
      <div class="col-2">
        <h3>
          <slot name="title" id="title"></slot>
        </h3>
      </div>
      <div class="col-9">
        <hr class="w-100" />
      </div>
      <div class="col-1">
        <button
          class="btn btn-outline-primary w-100"
          @click="collapsed = !collapsed"
        >
          {{ text }}
        </button>
      </div>
    </div>
    <div class="row" v-show="!collapsed">
      <slot></slot>
    </div>
  </div>
</template>

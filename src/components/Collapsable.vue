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
    <!-- HEADER -->
    <div
      class="row py-4"
      style="border-top: 1px solid #000; border-bottom: 1px solid #000"
    >
      <!-- LEFT -->
      <div class="col-9 col-sm-10">
        <div class="d-inline-flex">
          <slot name="title" id="title"></slot>
        </div>
      </div>
      <!-- LEFT -->
      <!-- RIGHT -->
      <div class="col-3 col-sm-2">
        <div @click="collapsed = !collapsed">
          <div v-if="!collapsed" class="text-center">
            <i class="fa-solid fa-chevron-up fa-2x d-block"></i>
            Collapse
          </div>
          <div v-else class="text-center word-">
            <i class="fa-solid fa-chevron-down fa-2x d-block"></i>
            Expand
          </div>
        </div>
        <!--
        <button class="btn btn-outline-primary" @click="collapsed = !collapsed">
          {{ text }}
        </button>
        -->
      </div>
      <!-- RIGHT -->
    </div>
    <!-- HEADER -->
    <!-- CONTENT -->
    <div class="row" v-show="!collapsed">
      <slot></slot>
    </div>
    <!-- CONTENT -->
  </div>
</template>

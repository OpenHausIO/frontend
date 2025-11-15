<template>
  <div v-if="visible">

    <!-- OVERLAY -->
    <Overlay></Overlay>
    <!-- OVERLAY -->

    <!-- MODAL -->
    <div class="modal" tabindex="-1" :class="{ show: visible }" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <slot name="header">

              <!-- DEAFULT HEADER-->
              <h5 class="modal-title">{{ title }}</h5>
              <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
              <!-- DEAFULT HEADER-->

            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">

              <!-- DEFAULT BODY -->
              {{ body }}
              <!-- DEFAULT BODY -->

            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">

              <!-- DEFAULT FOOTER -->
              <button type="button" class="btn btn-outline-secondary" @click="closeModal">Close</button>
              <button type="button" class="btn btn-outline-primary" @click="onConfirm">Save</button>
              <!-- DEFAULT FOOTER -->

            </slot>
          </div>
        </div>
      </div>
    </div>
    <!-- MODAL -->

  </div>
</template>

<script>
import Overlay from "./Overlay.vue";

export default {
  components: {
    Overlay
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Default Title",
    },
    body: {
      type: String,
      default: "Default Body",
    },
  },
  emits: [
    "close",
    "confirm"
  ],
  methods: {
    closeModal() {
      console.log("slodeModal")
      this.$emit("close");
    },
    onConfirm() {
      this.$emit("confirm");
    },
  },
};
</script>

<style scoped>
.modal {
  cursor: default;
}

.modal-header,
.modal-footer {
  border-top-width: 2px;
  border-bottom-color: #000;
  border-bottom-width: 2px;
  border-top-color: #000;
}

.modal-body {
  overflow: scroll;
  max-height: 40cap;
}

.modal-content {
  background-color: rgba(var(--bs-dark-rgb), 1) !important;
  /*background-color: #343a40;*/
}

.modal.fade.show {
  opacity: 1;
  display: block !important;
}

.modal-dialog {
  z-index: 1050;
}
</style>

<template>
  <div class="modal-overlay"></div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  /* Black with 50% opacity */
  z-index: 1040;
  /* Higher than the modal */
}
</style>
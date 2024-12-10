<template>
  <div>

    <!-- Trigger Buttons -->
    <button class="btn btn-primary" @click="openModal()">
      Open Custom Modal
    </button>

    <!-- Reusable Modal Component -->
    <Modal :visible="isModalVisible" @close="closeModal" @confirm="onModalConfirm">
      <template #header>

        Select states
        <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>

      </template>
      <template #body>


        <span v-for="i in 50" style="display: block">This is the super sexy body</span>

      </template>
      <!--
      <template #footer>

        Press <kbd>[ESC]</kbd>

      </template>
      -->
    </Modal>

  </div>
</template>

<script>
import Modal from '../components/Modal.vue';

export default {
  components: { Modal },
  data() {
    return {
      isModalVisible: false,
    };
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    onModalConfirm() {
      alert('Modal confirmed!');
      this.closeModal();
    },
  },
};
</script>

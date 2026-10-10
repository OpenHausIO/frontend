<script>
import { defineComponent, defineAsyncComponent } from "vue";
import Iframe from "../components/Iframe.vue";
import Modal from "../components/Modal.vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "WebView",
  props: {
    uuid: {
      type: String,
      required: true,
    },
    /*
    url: {
      type: String,
      required: true
    }
      */
  },
  components: {
    Iframe,
    Modal,
    Widget
  },
  data() {
    return {
      isModalVisible: false,
      data: {
        url: "http://example.com",
      },
      menu: [{
        title: "Edit URL",
        method: "editURL",
      }]
    };
  },
  mounted() {

    let data = window.localStorage.getItem(`widget-${this.uuid}`);

    if (data) {

      let json = JSON.parse(data);

      this.url = json.url;
      this.title = json.title

    }

  },
  methods: {
    editURL() {
      this.isModalVisible = true;
    },
    onModalConfirm() {
      this.data.url = this.$refs.url.value;
      this.isModalVisible = false;
    },
    onCloseModal() {
      this.isModalVisible = false;
    },
    selectedMenu(menu) {
      this[menu.method]();
    },
    loaded(data) {
      Object.assign(this.data, data);
    }
  },
});
</script>


<template>
  <Widget name="WebView" :menu="menu" @menu="selectedMenu" :uuid="uuid" :data="data" @loaded="loaded">

    <Modal :visible="isModalVisible" @close="onCloseModal" @confirm="onModalConfirm" title="Set URL to display">
      <template #body>
        <div>

          <input type="text" :value="data.url" placeholder="http://example.com" ref="url" class="w-100" />

        </div>
      </template>
    </Modal>

    <Iframe :src="data.url" />

  </Widget>
</template>

<style scoped></style>
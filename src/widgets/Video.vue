<script>
import { defineComponent, defineAsyncComponent } from "vue";
import Iframe from "../components/Iframe.vue";
import Modal from "../components/Modal.vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "Video",
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
      showTextbox: false,
      isModalVisible: false,
      url: "http://example.com",
      title: "",
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
    saveSettings() {

      let data = JSON.stringify({
        url: this.url,
        title: this.title,
      });

      window.localStorage.setItem(`widget-${this.uuid}`, data);

    },
    onModalConfirm() {

      this.url = this.$refs.url.value;

      this.saveSettings();

      this.isModalVisible = false;

    },
    onCloseModal() {
      this.isModalVisible = false;
    },
    closeEdit() {
      this.showTextbox = false;
      this.saveSettings();
    },
    editTitle() {
      this.showTextbox = true;
    },
    selectedMenu(menu) {
      this[menu.method]();
    }
  },
});
</script>


<template>
  <Widget name="Video" :menu="menu" @menu="selectedMenu" :uuid="uuid">

    <Modal :visible="isModalVisible" @close="onCloseModal" @confirm="onModalConfirm" title="Set URL to display">
      <template #body>
        <div>

          <input type="text" :value="url" placeholder="http://example.com" ref="url" class="w-100" />

        </div>
      </template>
    </Modal>

    <video :src="url" controls autoplay>
      No supported
    </video>

  </Widget>
</template>

<style scoped>
video {
  display: block;
  height: 100%;
  width: 100%;
}
</style>
<script>
import { defineComponent, defineAsyncComponent } from "vue";

//import Widget from "../components/Widget.vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "Notes",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  components: {
    Widget
  },
  data() {
    return {
      data: {
        content: "",
      },
      placeholder: "Click & type to add notes",
      menu: [{
        title: "Export as File",
        method: "export"
      }]
    };
  },
  mounted() {

  },
  methods: {
    loaded(data) {
      Object.assign(this.data, data);
    },
    save() {
      // this is no neede, because of the watcher in the Widget.vue
      // but i keep this as documentation/reference how you could clal methods
      // of child components directly in js
      //this.$refs.widget.saveToStorage();
    },
    selectedMenu(menu) {
      this[menu.method]();
    },
    export() {

      const { content } = this.data;

      const date = new Date().toISOString().slice(0, 10);
      const title = (this.$refs.widget?.title || "Notes").replace(/[\\/:*?"<>|]+/g, "").trim();

      if (window.AndroidBridge?.saveFile) {
        window.AndroidBridge.saveFile(`${title}-${date}.txt`, content);
        return;
      }

      const blob = new Blob([content], {
        type: "text/plain;charset=utf-8"
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${title}-${date}.txt`;

      document.body.appendChild(a);

      a.click();
      a.remove();

      URL.revokeObjectURL(url);

    }
  }
});
</script>


<template>
  <Widget name="Notes" :uuid="uuid" :data="data" @loaded="loaded" @menu="selectedMenu" :menu="menu" ref="widget">

    <textarea class="form-control bg-transparent text-white p-0" v-model="data.content" spellcheck="false"
      :placeholder="placeholder" @keyup="save()">
    </textarea>

  </Widget>
</template>

<style scoped>
textarea {
  display: block;
  box-sizing: border-box;
  width: calc(100% - 1rem);
  height: calc(100% - 1rem);
  margin: 0.5rem;
  border: none;
  resize: none;
}

textarea:focus {
  outline: none;
}
</style>
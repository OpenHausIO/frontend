<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Notes",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      title: "",
      content: "",
      showTextbox: false,
      placeholder: "Click & type to add notes",
    };
  },
  mounted() {
    let str = window.localStorage.getItem(`widget-${this.uuid}`);

    if (!str) {
      str = JSON.stringify({
        title: "",
        content: "",
      });

      window.localStorage.setItem(`widget-${this.uuid}`, str);
    }

    let config = JSON.parse(str);

    this.title = config.title;
    this.content = config.content || "";
  },
  methods: {
    keyUp() {
      window.localStorage.setItem(
        `widget-${this.uuid}`,
        JSON.stringify({
          content: this.content,
          title: this.title,
        })
      );
    },
    editTitle() {
      this.showTextbox = true;
    },
    closeEdit() {
      this.showTextbox = false;
      this.saveLocalStorage();
    },
    dispatchEvent(event) {
      console.log("diuspatchEvent called in notes.vue", event);
    },
    saveLocalStorage() {

      let str = JSON.stringify({
        content: this.content,
        title: this.title
      });

      window.localStorage.setItem(`widget-${this.uuid}`, str);
    },
  },
  menu: [{
    title: "Edit title",
    method: "editTitle",
  }, {
    title: "Done editing",
    method: "closeEdit",
  }]
});
</script>


<template>
  <div class="p-2 h-100">
    <h3>
      Notes: <input type="text" v-model="title" v-if="showTextbox" />
      <span v-else>
        {{ title }}
      </span>
    </h3>
    <div class="h-100 w-100">
      <textarea class="form-control bg-transparent w-100 p-0 border-0 text-white border border-0" v-model="content"
        spellcheck="false" :placeholder="placeholder" @keyup="keyUp()">
      </textarea>
    </div>
  </div>
</template>

<style scope>
textarea {
  resize: none;
  min-height: calc(100% - 40px) !important;
}
</style>
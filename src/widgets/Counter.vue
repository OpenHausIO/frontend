<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Counter",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      title: "",
      number: 0,
      showTextbox: false,
    };
  },
  mounted() {
    let str = window.localStorage.getItem(`widget-${this.uuid}`);

    if (!str) {
      str = JSON.stringify({
        title: "",
        number: 0,
      });

      window.localStorage.setItem(`widget-${this.uuid}`, str);
    }

    let config = JSON.parse(str);

    this.title = config.title;
    this.number = config.number || 0;
  },
  methods: {
    editTitle() {
      this.showTextbox = true;
    },
    closeEdit() {
      this.showTextbox = false;
    },
    dispatchEvent(event) {
      console.log("diuspatchEvent called in notes.vue", event);
    },
    save() {

      let data = JSON.stringify({
        number: this.number,
        title: this.title,
      });

      window.localStorage.setItem(`widget-${this.uuid}`, data);

    },
    increase() {
      this.number += 1;
      this.save();
    },
    decrase() {
      this.number -= 1;
      this.save();
    },
    reset() {
      this.number = 0;
      this.save();
    }
  },
  menu: [{
    title: "Edit title",
    method: "editTitle",
  }, {
    title: "Done editing",
    method: "closeEdit",
  }, {
    title: "Reset",
    method: "reset"
  }],
});
</script>


<template>
  <div class="p-2">
    <h3>
      Counter: <input type="text" v-model="title" v-if="showTextbox" @keyup="save()" />
      <span v-else>
        {{ title }}
      </span>
    </h3>
    <div class="w-100">
      <div class="container text-center">
        <div class="row">
          <div class="col h-100">
            <button class="btn btn-outline-primary btn-block" @click="decrase()">-</button>
          </div>
          <div class="col">
            <h3>{{ number }}</h3>
          </div>
          <div class="col">
            <button class="btn btn-outline-primary btn-block" @click="increase()">+</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scope>
textarea {
  resize: none;
  min-height: calc(100% - 40px) !important;
}
</style>
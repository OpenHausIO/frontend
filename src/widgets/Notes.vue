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
      placeholder: "Click & type to add notes"
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
    }
  }
});
</script>


<template>
  <Widget name="Notes" :uuid="uuid" :data="data" @loaded="loaded" ref="widget">

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
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
    this.content = config.content || this.placeholder;
  },
  methods: {
    keyPress() {
      window.localStorage.setItem(
        `widget-${this.uuid}`,
        JSON.stringify({
          content: this.content,
          title: this.title,
        })
      );
    },
  },
});
</script>


<template>
  <div class="p-2">
    <h3 class="float-start">Notes: {{ title }}</h3>
    <i
      class="
        fa-solid fa-ellipsis-vertical
        float-end
        border
        rounded-circle
        text-center
      "
      style="width: 25px; height: 25px"
      @click="$window.alert('Open Widget settings')"
    ></i>
    <div class="form-floating h-100 w-100">
      <textarea
        class="
          form-control
          bg-dark
          h-75
          w-100
          p-0
          border-0
          text-white
          border border-0
        "
        v-model="content"
        spellcheck="false"
        :placeholder="placeholder"
        @keypress="keyPress()"
      >
      </textarea>
    </div>
  </div>
</template>

<style scope>
textarea {
  resize: none;
  min-height: calc(100% - 33px);
}
</style>
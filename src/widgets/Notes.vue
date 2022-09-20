<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Notes",
  data() {
    return {
      title: "Einkaufsliste",
      content: "",
      placeholder: "Click & type to add notes",
    };
  },
  watch: {
    content(oldC, newC) {
      window.localStorage.setItem(`notes-${this.title}`, newC);
    },
  },
  mounted() {
    this.content = window.localStorage.getItem(`notes-${this.title}`);

    if (!this.content) {
      this.content = this.placeholder;
    }
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
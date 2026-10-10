<script>
import { defineComponent, defineAsyncComponent } from "vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "Counter",
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
        number: 0
      },
      menu: [{
        title: "Reset",
        method: "reset"
      }],
    };
  },
  methods: {
    increase() {
      this.data.number += 1;
    },
    decrase() {
      this.data.number -= 1;
    },
    reset() {
      this.data.number = 0;
    },
    selectedMenu(menu) {
      this[menu.method]();
    },
    loaded(data) {
      Object.assign(this.data, data);
    }
  }
});
</script>


<template>
  <Widget name="Counter" :menu="menu" @menu="selectedMenu" :uuid="uuid" :data="data" @loaded="loaded">

    <!--
    <div class="w-100">
      <div class="container text-center">
        <div class="row">
          <div class="col">
            <button class="btn btn-outline-primary btn-block" @click="decrase()">-</button>
          </div>
          <div class="col">
            <h3>{{ data.number }}</h3>
          </div>
          <div class="col">
            <button class="btn btn-outline-primary btn-block" @click="increase()">+</button>
          </div>
        </div>
      </div>
    </div>
    -->

    <div class="p-2">
      <div class="row align-items-center g-2">

        <div class="col">
          <button class="btn btn-outline-primary w-100" @click="decrase()">-</button>
        </div>

        <div class="col-auto text-center px-3" style="min-width: 6rem;">
          <h3 class="mb-0">{{ data.number }}</h3>
        </div>

        <div class="col">
          <button class="btn btn-outline-primary w-100" @click="increase()">+</button>
        </div>

      </div>
    </div>

  </Widget>
</template>

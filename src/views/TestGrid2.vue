<script>
import { defineComponent } from 'vue';
import Tile from "../components/Tile2.vue";
import Card from "../components/Card.vue";

export default defineComponent({
  components: {
    Tile,
    Card
  }
});
</script>

<template>
  <div class="d-grid" style="height: 100vh; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(3, 1fr);">

    <div class="d-flex justify-content-center align-items-center" v-for="i in 5 * 3" :key="i">
      <Tile :title="'Hello World #' + i" :footer="'(Footer ' + i + ')'"></Tile>
      <!--
      <Tile>
        <template #title>
          <h3 class="mt-2 d-block text-center">
            Hello World {{ i }}
          </h3>
        </template>
<template #footer>
          footer
        </template>
</Tile>
-->
    </div>


    <!--
    <div class="d-flex justify-content-center align-items-center">1</div>
    <div class="d-flex justify-content-center align-items-center">2</div>
    <div class="d-flex justify-content-center align-items-center">3</div>
    <div class="d-flex justify-content-center align-items-center">4</div>
    <div class="d-flex justify-content-center align-items-center">5</div>
    <div class="d-flex justify-content-center align-items-center">6</div>
    <div class="d-flex justify-content-center align-items-center">7</div>
    <div class="d-flex justify-content-center align-items-center">8</div>
    <div class="d-flex justify-content-center align-items-center">9</div>
    -->

  </div>
</template>


<style scoped>
/*
.d-grid>* {
  border: 1px solid #000 !important;
}
  */
</style>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Scenes",
  data() {
    return {};
  },
});
</script>


<template>
  <div class="p-2">
    <h3>Scenes</h3>
    <br /><br />
    <div class="row">
      <div class="col-2 text-center">
        <i class="fa-solid fa-video fa-6x"></i>
        <h6>Kino</h6>
      </div>

      <div class="col-2 text-center">
        <i class="fa-regular fa-lightbulb fa-6x"></i>
        <h6>Abends</h6>
      </div>

      <div class="col-2 text-center">
        <i class="fa-brands fa-playstation fa-6x"></i>
        <h6>PS5 Zocken</h6>
      </div>

      <div class="col-2 text-center">
        <i class="fa-solid fa-tv fa-6x"></i>
        <h6>Fernsehen</h6>
      </div>

      <div class="col-2 text-center">
        <i class="fa-solid fa-music fa-6x"></i>
        <h6>Musik hören</h6>
      </div>

      <div class="col-2 text-center">
        <i class="fa-solid fa-fan fa-6x"></i>
        <h6>Lüften</h6>
      </div>
    </div>
  </div>
</template>

<style scope>
ul {
  list-style: none;
  padding: 0;
}
</style>
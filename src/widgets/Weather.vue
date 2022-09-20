<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Weather",
  data() {
    return {};
  },
});
</script>


<template>
  <div
    class="h-100 p-2"
    style="
      background-image: url(https://png.pngtree.com/background/20210714/original/pngtree-white-cloud-on-blue-sky-weather-background-picture-image_1229456.jpg);
    "
  >
    <div class="row">
      <div class="col-12">
        <div class="float-start">
          <h3>Montag</h3>
          <h1>25°C</h1>
        </div>
        <div class="float-end">
          <i class="fa-solid fa-sun fa-5x text-warning"></i>
        </div>
      </div>
    </div>
    <div class="row h-100">
      <div class="col-12 h-100">
        <ol class="h-100">
          <li class="p-1">
            <h5>Dienstag</h5>
          </li>
          <li class="p-1">
            <h5>Mittwoch</h5>
          </li>
          <li class="p-1">
            <h5>Donnerstag</h5>
          </li>
          <li class="p-1">
            <h5>Freitag</h5>
          </li>
          <li class="p-1">
            <h5>Samstag</h5>
          </li>
          <li class="p-1">
            <h5>Sonntag</h5>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style scope>
ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

ol > li {
  background-color: rgba(255, 255, 255, 0.25);
  display: inline-block;
  width: calc(100% / 6 - 10px);
  height: calc(100% - 100px);
  margin: 0 5px;
  border: 1px solid #000;
  color: gray;
}

ol > li:first-child {
  margin-left: 0;
}

ol > li:last-child {
  margin-right: 0;
}
</style>
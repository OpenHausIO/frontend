<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Weather",
  data() {
    return {};
  },
  menu: [],
});
</script>

<!--     style="
      background-image: url(https://png.pngtree.com/background/20210714/original/pngtree-white-cloud-on-blue-sky-weather-background-picture-image_1229456.jpg);
    "-->

<template>
  <div class="h-100 p-2">
    <div class="row">
      <div class="col-12">
        <div class="float-start">
          <h3>Montag</h3>
          <h1>25°C</h1>
        </div>
        <div class="float-end">
          <img src="icons/sun.png" width="75px" />
        </div>
      </div>
    </div>
    <div class="row h-100">
      <div class="col-12 h-100">
        <ol class="h-100">
          <li class="p-1 text-center">
            <h5>Dienstag</h5>
            <img src="icons/sun.png" width="50px" class="m-3" />
            <b class="d-block">25°C</b>
            <span class="d-block">16°C</span>
            <span class="d-block">0 km/h</span>
            <span class="d-block">2 %</span>
          </li>
          <li class="trenner"></li>
          <li class="p-1 text-center">
            <h5>Mittwoch</h5>
            <img src="icons/sun.png" width="50px" class="m-3" />
            <b class="d-block">22°C</b>
            <span class="d-block">17°C</span>
            <span class="d-block">0 km/h</span>
            <span class="d-block">2 %</span>
          </li>
          <li class="trenner"></li>
          <li class="p-1 text-center">
            <h5>Donnerstag</h5>
            <img src="icons/cloud.png" width="50px" class="m-3" />
            <b class="d-block">18°C</b>
            <span class="d-block">15°C</span>
            <span class="d-block">0 km/h</span>
            <span class="d-block">2 %</span>
          </li>
          <li class="trenner"></li>
          <li class="p-1 text-center">
            <h5>Freitag</h5>
            <img src="icons/rainy-day.png" width="50px" class="m-3" />
            <b class="d-block">16°C</b>
            <span class="d-block">12°C</span>
            <span class="d-block">0 km/h</span>
            <span class="d-block">48 %</span>
          </li>
          <li class="trenner"></li>
          <li class="p-1 text-center">
            <h5>Samstag</h5>
            <img src="icons/cloudy1.png" width="50px" class="m-3" />
            <b class="d-block">18°C</b>
            <span class="d-block">14°C</span>
            <span class="d-block">0 km/h</span>
            <span class="d-block">8 %</span>
          </li>
          <li class="trenner"></li>
          <li class="p-1 text-center">
            <h5>Sonntag</h5>
            <img src="icons/cloudy2.png" width="50px" class="m-3" />
            <b class="d-block">19°C</b>
            <span class="d-block">16°C</span>
            <span class="d-block">0 km/h</span>
            <span class="d-block">82 %</span>
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
  /*background-color: rgba(255, 255, 255, 0.25);*/
  display: inline-block;
  width: calc(100% / 6 - 18px);
  height: calc(100% - 100px);
  margin: 0 5px;
  /*border: 1px solid #000;*/
  color: gray;
}

ol > li:first-child {
  margin-left: 0;
}

ol > li:last-child {
  margin-right: 0;
}

ol > li.trenner {
  height: calc(100% - 120px);
  width: 1px;
  background-color: gray;
  display: inline-block;
}
</style>
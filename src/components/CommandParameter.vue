<script>
import Tile from "./Tile.vue";

export default {
  components: {
    Tile
  },
  props: ["param"],
  data() {
    return {
      data: {},
    };
  }
};
</script>



<template>
  <div>

    <div v-if="param.type === 'number'">

      {{ param.name }}

      <br />

      <input type="range" :class="param.classes" v-model="param.value" @change="$emit('changed')" :min="param.min"
        :max="param.max" :style="{
          '--pointerBgColor': param.value
        }">

    </div>
    <div v-else-if="param.type === 'string'">

      <!--
      <Tile style="background: transparent; border: 1px solid rgb(0, 0, 0)" @click="$emit('changed')">
        <div>{{ param.name || param.value }} </div>
      </Tile>
      -->

      <div class="btn btn-outline-primary w-100 mb-2" @click="$emit('changed')">{{ param.name || param.value }} </div>

    </div>
    <div v-else-if="param.type === 'boolean'">

      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" :id="'booleanCheckboxParameter' + param._id"
          v-model="param.value" @change="$emit('changed')" />
        <label class="form-check-label small" :for="'booleanCheckboxParameter' + param._id">
          {{ param.name }}
        </label>
      </div>

    </div>
    <div v-else>
      Unsupported type "{{ param.type }}"
    </div>

    {{ param.name || param.key }} = {{ param.value }}

    <!--

    {{ param.name }}

    <div v-if="param.type === 'number'">

      <input type="range" :class="param.classes" v-model="param.value" @change="$emit('changed')" :min="param.min"
        :max="param.max" :style="{
          '--pointerBgColor': param.value
        }">

    </div>
    <div v-else-if="param.type === 'string'">

      <input type="button" class="btn btn-primary w-100 mb-1" :value="param.value" @click="$emit('changed')">

    </div>
    <div v-else-if="param.type === 'boolean'">

      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" :id="'booleanCheckboxParameter' + param._id" v-model="param.value"
          @change="$emit('changed')" />
        <label class="form-check-label small" :for="'booleanCheckboxParameter' + param._id">
          {{ param.name }}
        </label>
      </div>

    </div>
    <div v-else>
      Unsupported type "{{ param.type }}"
    </div>

  -->

  </div>
</template>

<style scoped>
/*
https://codepen.io/stoumann/full/QWKdKxJ
https://codepen.io/adrianparr/pen/MYmrdJ
https://codepen.io/stoumann/pen/QWKdKxJ
*/
input[type="range"].hsv-fader {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  width: 100%;
  height: 6px;
  background-image: linear-gradient(to right, red, #ff8000, #ff0, #80ff00, lime, #00ff80, cyan, #007fff, blue, #7f00ff, #f0f, #ff0080, red);
}

input[type="range"].hsv-fader::-webkit-slider-thumb,
input[type="range"].hsv-fader::-moz-range-thumb {
  background-color: hsl(var(--pointerBgColor), 100%, 50%);
  /*rgba(0, 0, 0, 0.5);*/
  border-color: black;
  border-width: 2px;
  border-radius: 100%;
  /*-webkit-box-shadow: 0px 0px 4px 0px hsl(var(--pointerBgColor), 100%, 50%);*/
  box-shadow: 0px 0px 8px 0px hsl(var(--pointerBgColor), 100%, 30%);
}

input[type="range"].brightness-fader {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  width: 100%;
  height: 6px;
  background-image: linear-gradient(to right, #000, #fff);
}

input[type="range"].brightness-fader::-webkit-slider-thumb,
input[type="range"].brightness-fader::-moz-range-thumb {
  background-color: #fff;
  filter: brightness(calc(var(--pointerBgColor) * 0.01));
  border-color: black;
  border-width: 2px;
  border-radius: 100%;
  /*-webkit-box-shadow: 0px 0px 4px 0px hsl(var(--pointerBgColor), 100%, 50%);*/
  box-shadow: 0px 0px 8px 0px hsl(var(--pointerBgColor), 100%, 30%);
}


input[type="range"].fader-color-r {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  width: 100%;
  height: 6px;
  background-image: linear-gradient(to right, #000, #f00);
}

input[type="range"].fader-color-r::-webkit-slider-thumb,
input[type="range"].fader-color-r::-moz-range-thumb {
  background-color: #f00;
  border-color: black;
  border-width: 2px;
  border-radius: 100%;
}

input[type="range"].fader-color-g {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  width: 100%;
  height: 6px;
  background-image: linear-gradient(to right, #000, #0f0);
}

input[type="range"].fader-color-g::-webkit-slider-thumb,
input[type="range"].fader-color-g::-moz-range-thumb {
  background-color: #0f0;
  border-color: black;
  border-width: 2px;
  border-radius: 100%;
}

input[type="range"].fader-color-b {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  width: 100%;
  height: 6px;
  background-image: linear-gradient(to right, #000, #00f);
}

input[type="range"].fader-color-b::-webkit-slider-thumb,
input[type="range"].fader-color-b::-moz-range-thumb {
  background-color: #00f;
  border-color: black;
  border-width: 2px;
  border-radius: 100%;
}
</style>
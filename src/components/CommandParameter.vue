<script>
import Tile from "./Tile.vue";
import { watch } from "vue";

const CLASS_TO_SHARED = {
  "hue-fader": "hue",
  "brightness-fader": "bri",
  "saturation-fader": "sat"
};

export default {
  components: {
    Tile
  },
  emits: ['changed'],
  props: {
    param: {
      type: Object,
      required: true
    },
    command: {
      type: Object,
      required: true
    },
    shared: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      data: {},
    };
  },
  methods: {
    updateSharedFromClasses(value) {

      const classes = Array.isArray(this.param.classes)
        ? this.param.classes
        : (this.param.classes || "").split(" ")

      for (const cls of classes) {
        const key = CLASS_TO_SHARED[cls]
        if (key) this.shared[key] = value
      }

    }
  },
  mounted() {

    // debugging fallback fader colors
    //this.shared.hue = 40;
    //this.shared.hue = undefined;

    /*
    // draft for sync between browsers/clients
    watch(this.param, (value) => {
      this.updateSharedFromClasses(value.value);
    });
    */

    let value = this.param.value ?? 0;
    this.updateSharedFromClasses(value);

  },
};
</script>



<template>
  <div :style="{
    '--hue': shared.hue,
    '--sat': shared.sat,
    '--bri': shared.bri
  }" class="py-3" @click.stop>

    <div v-if="param.type === 'number'">

      {{ param.name }}

      <input type="range"
        :class="[param.classes?.length > 0 ? param.classes : ['form-range'], shared.hue ? 'has-hue' : '']"
        v-model="param.value" @input="$emit('changed'); updateSharedFromClasses(param.value)" :min="param.min"
        :max="param.max" />

      {{ param.name || param.key }} = {{ param.value }}

    </div>
    <div v-else-if="param.type === 'string'">

      <!--
      <Tile style="background: transparent; border: 1px solid rgb(0, 0, 0)" @click="$emit('changed')">
        <div>{{ param.name || param.value }} </div>
      </Tile>
      -->

      <!--
      <div class="btn btn-outline-primary w-100 mb-2" @click="$emit('changed')">
        {{ param.name || param.value }}
      </div>
      -->

      <div v-if="param?.enum?.length > 0">

        <select class="form-select bg-transparent text-white" v-model="param.value" @change="$emit('changed')"
          style="border-color: #000">
          <option :value="option.value" :selected="option.value === param.value" v-for="option in param.enum">
            {{ option.name }}
          </option>
        </select>

      </div>
      <div v-else>

        <input type="text" class="form-control bg-transparent text-white" placeholder="Insert text..."
          v-model="param.value" />

      </div>

    </div>
    <div v-else-if="param.type === 'boolean'">

      <div class="form-check form-switch d-flex justify-content-center">
        <input class="form-check-input " type="checkbox" :id="'booleanCheckboxParameter' + param._id"
          v-model="param.value" @change="$emit('changed')" />
        <label class="form-check-label small" :for="'booleanCheckboxParameter' + param._id">
          {{ param.name }}
        </label>
      </div>

    </div>
    <div v-else>
      Unsupported type "{{ param.type }}"
    </div>

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
input[type="range"].hue-fader {
  background-image: linear-gradient(to right, red, #ff8000, #ff0, #80ff00, lime, #00ff80, cyan, #007fff, blue, #7f00ff, #f0f, #ff0080, red) !important;
}

input[type="range"].hue-fader::-webkit-slider-thumb,
input[type="range"].hue-fader::-moz-range-thumb {
  background-color: hsl(var(--hue), 100%, 50%);
}

input[type="range"].brightness-fader {
  /*background-image: linear-gradient(to right, #000, hsl(var(--hue), 100%, 50%));*/
  background-image: linear-gradient(to right, #000, transparent), linear-gradient(to bottom, red, green, blue);
}

input[type="range"].brightness-fader.has-hue {
  background-image: linear-gradient(to right, #000, hsl(var(--hue), 100%, 50%));
}

input[type="range"].saturation-fader {
  /*background-image: linear-gradient(to right, #fff, hsl(var(--hue), 100%, 50%));*/
  background-image: linear-gradient(to right, #fff, transparent), linear-gradient(to bottom, red, green, blue);
}

input[type="range"].saturation-fader.has-hue {
  background-image: linear-gradient(to right, #fff, hsl(var(--hue), 100%, 50%));
}

input[type="range"].fader-color-r {
  background-image: linear-gradient(to right, #000, #f00);
}

input[type="range"].fader-color-g {
  background-image: linear-gradient(to right, #000, #0f0);
}

input[type="range"].fader-color-b {
  background-image: linear-gradient(to right, #000, #00f);
}

input[type="range"] {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  height: 4px;
  border-radius: 2px;
}

input[type=range]::-webkit-slider-runnable-track,
input[type=range]::-moz-range-track {
  height: 4px;
}

input[type=range]::-webkit-slider-thumb,
input[type=range]::-moz-range-thumb {
  height: 18px;
  width: 18px;
  /*this override bootstrap */
  /*border: 2px solid #000;*/
  /*this does not affect bootstrap styling */
  border-color: black;
  border-width: 0px;
  border-radius: 100%;
}
</style>
<script setup>
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
import { defineComponent } from "vue";

import Grid from "./Grid.vue";

export default defineComponent({
  name: "PageLayouts",
  emits: ["trigger"],
  props: {
    endpoint: {
      type: Object,
      required: true
    }
  },
  components: {
    Grid
  },
  data() {
    return {
      active: 0,
      page: null,
      swipeStartX: 0,
      swipeEndX: 0,
      isMouseDown: false,
    };
  },
  computed: {
    carousel() {
      return this.endpoint.pages;
    }
  },
  methods: {
    setPage() {
      this.page = this.carousel[this.active];
    },
    nextPage() {

      /*
      if (this.active < this.carousel.length - 1) {
        this.active += 1;
      }
      */

      // from welcome widget
      // this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      this.active = (this.active + 1) % this.carousel.length;

      this.setPage();

    },
    prevPage() {

      /*
      if (this.active > 0) {
        this.active -= 1;
      }
      */

      // from welcome widget
      // this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
      this.active = (this.active - 1 + this.carousel.length) % this.carousel.length;

      this.setPage();

    },
    showPage(index) {
      this.active = index;
      this.setPage();
    },
    gridItems(page) {
      return page.items.map((item) => {

        /*
        item.size = Object.assign({
          w: 1,
          h: 1
        }, item.size);
        */

        return {
          position: item.position,
          size: Object.assign({
            w: 1,
            h: 1
          }, item.size),
          cmd: this.getCommandByAlias(item.alias),
          state: this.getStateByAlias(item.alias),
          item
        };

      });
    },
    getCommandByAlias(alias) {
      return this.endpoint.commands.find((command) => {
        return command.alias === alias;
      });
    },
    getStateByAlias(alias) {
      return this.endpoint.states.find((state) => {
        return state.alias === alias;
      });
    },

    handleSwipeStart(e) {
      this.swipeStartX = e.type.includes("mouse")
        ? e.screenX
        : e.changedTouches[0].screenX;

      if (e.type.includes("mouse")) {
        this.isMouseDown = true;
      }
    },

    handleSwipeEnd(e) {
      // Bei Mouse: nur wenn tatsächlich gedrückt war
      if (e.type.includes("mouse") && !this.isMouseDown) return;

      this.swipeEndX = e.type.includes("mouse")
        ? e.screenX
        : e.changedTouches[0].screenX;

      this.handleSwipe();
      this.isMouseDown = false;
    },

    handleSwipe() {
      const minSwipeDistance = 50;
      const diff = this.swipeStartX - this.swipeEndX;

      if (Math.abs(diff) < minSwipeDistance) return;

      if (diff > 0) {
        // Swipe left
        this.nextPage();
      } else {
        // Swipe right
        this.prevPage();
      }
    }

  },
  mounted() {
    const el = this.$refs.touchplace;

    // Touch events
    el.addEventListener("touchstart", this.handleSwipeStart);
    el.addEventListener("touchend", this.handleSwipeEnd);

    // Mouse events
    el.addEventListener("mousedown", this.handleSwipeStart);
    el.addEventListener("mouseup", this.handleSwipeEnd);

    this.setPage();
  },
  beforeUnmount() {
    const el = this.$refs.touchplace;

    el?.removeEventListener("touchstart", this.handleSwipeStart);
    el?.removeEventListener("touchend", this.handleSwipeEnd);
    el?.removeEventListener("mousedown", this.handleSwipeStart);
    el?.removeEventListener("mouseup", this.handleSwipeEnd);
  }

});
</script>

<template>
  <div class="h-100">
    <div class="h-100" ref="touchplace">
      <div class="h-100" v-if="page" :style="{ 'padding': `${settings.layout.gap}px` }">

        <Grid :items="gridItems(page)" :cols="page.size.w" :rows="page.size.h" :gap="Number(settings.layout.gap)">
          <template #item="{ item, index, cmd }">

            <div v-if="item.type === 'command'"
              class="h-100 w-100 text-center d-flex flex-column justify-content-center align-items-center card"
              style="border: 1px solid #000 !important" @click=" $emit('trigger', cmd._id)"
              :style="{ 'border-radius': `${settings.layout.borderRadius}px` }">

              <h3 class="mt-4 d-block">
                <i class="fa-regular" :class="cmd?.icon || 'fa-circle-question'" />
              </h3>

              {{ cmd.name }}

            </div>
            <div v-else-if="item.type === 'state'" class="h-100 w-100" style="border: 1px solid #000">

              State, {{ state }}

            </div>
            <div v-else-if="item.type === 'empty'" class="h-100 w-100" style="border: 1px solid #000">

              &nbsp;

            </div>
            <div v-else>
              Unknown
            </div>

          </template>
        </Grid>

        <!--
        <GridDraggable :items=" gridItems(page, endpoint)" :cols="page.size.w" :rows="page.size.h">
              <template #item="{ data }">

                <Tile class="w-100" @click="() => { $emit("trigger", data._id) }">
                  <template #title>
                    <i :class="data.icon || "fa-regular fa-circle-question""></i>
                  </template>
                  {{ data.name }}
                </Tile>

              </template>
              </GridDraggable>
              -->

      </div>

    </div>
    <div id="indicator">
      <ul class="flexible-list">
        <li v-for="(page, index) in endpoint?.pages || []" :key="index" :class="{ 'active': index === active }"
          :data-tooltip="page.title" @click="showPage(index)">
        </li>
      </ul>
    </div>
  </div>
</template>


<style scoped>
.flexible-list {
  list-style: none;
  display: flex;
  width: 100%;
  padding: 0;
  justify-content: center;
}

.flexible-list li {
  flex: 1;
  max-width: clamp(1%, 25px, 25px);
  background-color: #000;
  height: 3px;
  margin: 2px;
}

.flexible-list li.active {
  background-color: var(--bs-blue);
  box-shadow: 0px 0px 10px 1px var(--bs-blue);
}

#indicator {
  position: fixed;
  bottom: 0px;
  width: 100%;
  color: #fff;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

#grid-container {
  display: grid;
  height: calc(100%);
  grid-auto-rows: 1fr;
  /*see: https://stackoverflow.com/a/44490047/5781499 */
  gap: 0px;
}

.grid-item {
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 1px);
}

/* ==================================================================*/

/* Add this attribute to the element that needs a tooltip */
[data-tooltip] {
  position: relative;
  z-index: 2;
  cursor: pointer;
}

/* Hide the tooltip content by default 
 * Show the tooltip, if always-on by data attributes
 */
[data-tooltip]:not([data-tooltip-alwayson]):before,
[data-tooltip]:not([data-tooltip-alwayson]):after {
  visibility: hidden;
  opacity: 0.0;
}

/* Prevent click events */
[data-tooltip]:before,
[data-tooltip]:after {
  pointer-events: none;
}

/* Show tooltip content on hover */
[data-tooltip]:hover:before,
[data-tooltip]:hover:after {
  visibility: visible;
  opacity: 1;
}

/* Position tooltip above the element */
[data-tooltip]:before {
  position: absolute;
  transform: translateX(-50%);
  padding: 7px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  content: attr(data-tooltip);
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
  left: 50%;
  margin-bottom: 10px;
  word-break: keep-all;

  min-width: 100px;
  bottom: 110%;
}

/* Triangle hack to make tooltip look like a speech bubble */
[data-tooltip]:after {
  position: absolute;
  content: " ";
  font-size: 0;
  line-height: 0;
  left: 50%;
  margin-left: -5px;
  width: 0;

  bottom: 110%;
  /*border-top: 10px solid hsla(0, 0%, 20%, 1.0);*/
  border-top: 10px solid rgba(0, 0, 0, 0.5);
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
}

/* Position tooltip below the element */
[data-tooltip-pos="bottom"]:before {
  bottom: initial;
  top: 120%;
}

[data-tooltip-pos="bottom"]:after {
  bottom: initial;
  top: 120%;
  margin-top: -5px;

  border-top: none;
  border-bottom: 5px solid hsla(0, 0%, 20%, 1.0);
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
}
</style>
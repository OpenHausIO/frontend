<script setup>
import { useSwipe, usePointerSwipe } from '@vueuse/core'
import Tile from "../components/Tile.vue";
</script>

<script>

export default {
  data() {

    const p1 = [{
      x: 1,
      y: 1,
      h: 1,
      w: 1,
      //title: "0",
      icon: "fa-solid fa-0"
    }, {
      x: 1,
      y: 2,
      h: 1,
      w: 1,
      //title: "1",
      icon: "fa-solid fa-1"
    }, {
      x: 1,
      y: 3,
      h: 1,
      w: 1,
      //title: "2",
      icon: "fa-solid fa-2"
    }, {
      x: 2,
      y: 1,
      h: 1,
      w: 1,
      //title: "3",
      icon: "fa-solid fa-3"
    }, {
      x: 2,
      y: 2,
      h: 1,
      w: 1,
      //title: "4",
      icon: "fa-solid fa-4"
    }, {
      x: 2,
      y: 3,
      h: 1,
      w: 1,
      //title: "5",
      icon: "fa-solid fa-5"
    }, {
      x: 3,
      y: 1,
      h: 1,
      w: 1,
      //title: "6",
      icon: "fa-solid fa-6"
    }, {
      x: 3,
      y: 2,
      h: 1,
      w: 1,
      //title: "7",
      icon: "fa-solid fa-7"
    }, {
      x: 3,
      y: 3,
      h: 1,
      w: 1,
      //title: "8",
      icon: "fa-solid fa-8"
    }, {
      x: 4,
      y: 2,
      h: 1,
      w: 1,
      //title: "9",
      icon: "fa-solid fa-9"
    }, {
      x: 4,
      y: 1,
      h: 1,
      w: 1,
      title: "Exit",
      icon: "fa-regular fa-circle-xmark"
    }, {
      x: 4,
      y: 3,
      h: 1,
      w: 1,
      title: "Enter",
      icon: "fa-regular fa-circle-check"
    }];

    const p2 = [{
      x: 7,
      y: 1,
      h: 1,
      w: 1,
      title: "Exit",
      icon: "fa-regular fa-circle-xmark"
    }, {
      x: 7,
      y: 3,
      h: 1,
      w: 1,
      title: "Enter",
      icon: "fa-regular fa-circle-check"
    }, {
      x: 2,
      y: 2,
      h: 1,
      w: 1,
      title: "UP",
      icon: "fa-solid fa-arrow-up"
    }, {
      x: 4,
      y: 2,
      h: 1,
      w: 1,
      title: "DOWN",
      icon: "fa-solid fa-arrow-down"
    }, {
      x: 3,
      y: 1,
      h: 1,
      w: 1,
      title: "LEFT",
      icon: "fa-solid fa-arrow-left"
    }, {
      x: 3,
      y: 3,
      h: 1,
      w: 1,
      title: "RIGHT",
      icon: "fa-solid fa-arrow-right"
    }];

    return {
      active: 1,
      page: null,
      pages: [{
        title: "Numbers",
        show: true,
        gap: false,
        size: {
          cols: 3,
          rows: 4
        },
        items: p1
      }, {
        title: "Navigation",
        show: true,
        gap: true,
        size: {
          cols: 3,
          rows: 7
        },
        items: p2
      }, {
        title: "Page #3",
        show: false,
        size: {
          cols: 18,
          rows: 18
        }
      }, {
        title: "Page #4",
        show: false,
        size: {
          cols: 2,
          rows: 2
        }
      }]
    };
  },
  computed: {
    carousel() {
      return this.pages.filter(({ show }) => {
        return show;
      });
    }
  },
  methods: {
    setPage() {
      this.page = this.carousel[this.active];
    },
    nextPage() {

      if (this.active < this.carousel.length - 1) {
        this.active += 1;
      }

      this.setPage();

    },
    prevPage() {

      if (this.active > 0) {
        this.active -= 1;
      }

      this.setPage();

    },
    showPage(index) {
      this.active = index;
      this.setPage();
    }
  },
  mounted() {

    usePointerSwipe(this.$refs.touchplace, {
      onSwipeEnd: (event, direction) => {
        if (direction === "left") {
          this.nextPage();
        } else if (direction === "right") {
          this.prevPage();
        }
      }
    });

    this.setPage();

  }

};
</script>

<template>
  <div>
    <div class="h-100" ref="touchplace">

      <div class="h-100" v-if="page">
        <div
          :style="{ gridTemplateColumns: `repeat(${page.size.cols}, 1fr)`, gridTemplateRows: `repeat(${page.size.rows}, 1fr)` }"
          id="grid-container">

          <Tile style="background: transparent; border: 1px solid rgb(0, 0, 0)" v-for="(item, i) in page.items" :key="i"
            class="grid-item" :style="{ gridArea: `${item.x} / ${item.y} / span ${item.h} / span ${item.w}` }">
            <template #title>
              <i :class="item?.icon || 'fa-regular fa-circle-question'"></i>
            </template>
            <h4>{{ item.title || "Key" }}</h4>
          </Tile>

          <!--
            <h3 style="display: block;">
              {{ item.title }}
            </h3>
            <div style="font-size: 12px;" class="hide">
              #{{ i }}&nbsp;
              <span style="color: red;">x</span>= {{ item.x }},&nbsp;
              <span style="color: blue;">y</span>= {{ item.y }},&nbsp;
              <span style="color: yellow;">w</span>= {{ item.w }},&nbsp;
              <span style="color: yellow;">h</span>= {{ item.h }}
            </div>
          -->
        </div>
      </div>

    </div>
    <div id="indicator">
      <ul class="flexible-list">
        <li v-for="(page, index) in carousel " :key="index" :class="{ 'active': index === active }"
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
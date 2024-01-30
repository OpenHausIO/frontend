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
      title: "0",
      icon: "fa-solid fa-0"
    }, {
      x: 1,
      y: 2,
      h: 1,
      w: 1,
      title: "1",
      icon: "fa-solid fa-0"
    }, {
      x: 1,
      y: 3,
      h: 1,
      w: 1,
      title: "2",
      icon: "fa-solid fa-0"
    }, {
      x: 2,
      y: 1,
      h: 1,
      w: 1,
      title: "3",
      icon: "fa-solid fa-0"
    }, {
      x: 2,
      y: 2,
      h: 1,
      w: 1,
      title: "4",
      icon: "fa-solid fa-0"
    }, {
      x: 2,
      y: 3,
      h: 1,
      w: 1,
      title: "5",
      icon: "fa-solid fa-0"
    }, {
      x: 3,
      y: 1,
      h: 1,
      w: 1,
      title: "6",
      icon: "fa-solid fa-0"
    }, {
      x: 3,
      y: 2,
      h: 1,
      w: 1,
      title: "7",
      icon: "fa-solid fa-0"
    }, {
      x: 3,
      y: 3,
      h: 1,
      w: 1,
      title: "8",
      icon: "fa-solid fa-0"
    }, {
      x: 4,
      y: 1,
      h: 1,
      w: 3,
      title: "9",
      icon: "fa-solid fa-0"
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
        title: "Page #1",
        show: true,
        size: {
          cols: 3,
          rows: 3
        },
        items: p1
      }, {
        title: "Page #2",
        show: true,
        size: {
          cols: 3,
          rows: 3
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
            <h5>{{ item.title }}</h5>
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
        <li v-for="(page, index) in  carousel " :key="index" :class="{ 'active': index === active }"></li>
      </ul>
    </div>
  </div>
</template>


<style scoped>
.flexible-list {
  list-style: none;
  display: flex;
  width: 10%;
  padding: 0;
  /* Entferne den Standardinnenabstand der UL */
}

.flexible-list li {
  flex: 1;
  /*border-bottom: 2px solid #000;*/
  background-color: #000;
  padding: 1px;
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
  /*gap: 1px; /* Optional: Add gap between grid items */
}

.grid-item {
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 1px);
}
</style>
<template>
  <div class="h-100 w-100 wrapper">

    <!--
    <Grid :items="items" :cols="grid.cols" :rows="grid.rows" :showGrid="false">
      <template #item="{ index, data }">

        <div class="wrapper-item">
          Item #{{ index + 1 }}
        </div>

      </template>
</Grid>
-->

    <GridDraggable :items="items" :cols="grid.cols" :rows="grid.rows">
      <template #item="{ index, data }">

        <div class="wrapper-item">
          Item #{{ index + 1 }}
        </div>

      </template>
    </GridDraggable>

  </div>
</template>

<script>
import Grid from "../components/Grid.vue";
import GridDraggable from "../components/GridDraggable.vue";

export default {
  components: {
    Grid,
    GridDraggable
  },
  data() {
    return {
      grid: {
        cols: 3,
        rows: 5
      },
      items: [{
        position: {
          x: 1, // horizontal
          y: 1 // vertical
        },
        size: {
          h: 1,
          w: 1
        }
      }, {
        position: {
          x: 3,
          y: 5
        },
        size: {
          h: 1,
          w: 1
        }
      }, {
        position: {
          x: 2,
          y: 3
        },
        size: {
          h: 1,
          w: 1
        }
      }, {
        position: {
          x: 1,
          y: 2
        },
        size: {
          h: 1,
          w: 1
        }
      }]
    }
  }
}
</script>

<style scoped>
.wrapper {
  /*background-color: red;*/
  height: 100%;
  width: 100%;
}

.wrapper-item {
  height: 100%;
  width: 100%;
  border: 1px solid #000;
}
</style>
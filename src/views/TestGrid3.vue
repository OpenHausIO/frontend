<template>
  <div class="h-100 w-100 wrapper">
    <Grid>
      <GridItem :x="1" :y="2"></GridItem>
      <GridItem :x="3" :y="1"></GridItem>
      <GridItem :x="5" :y="5"></GridItem>
    </Grid>
  </div>
</template>

<script>
import Grid from "../components/Gird3.vue";
import GridItem from '../components/GridItem.vue';

export default {
  components: {
    Grid,
    GridItem
  }
}
</script>

<style scoped>
.wrapper {
  background-color: #fff;
  height: 100%;
  width: 100%;
}
</style>
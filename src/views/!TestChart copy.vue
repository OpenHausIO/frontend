<template>
<div class="container-fluid">

  <div class="row display-flex text-center">
<!--<MyChart :chartData="chartData" :chartOptions="chartOptions" />-->
  </div>

      <!-- ITEM -->
    <div
      class="row display-flex text-center"
    >

        <div class="p-0 col-6 col-md-3 col-xl-2" v-for="index in 10" :key="index" >
          <Tile
            :href="href"
            @click="navigate"
            style="background: transparent; border: 1px solid #000; padding: 0"
          >
            <template #icon>
              <i class="fa-2xl fa-question"></i>
            </template>
            <template #title>#{{ index }} </template>
             <MyChart :chartData="chartData" :chartOptions="chartOptions" />
          </Tile>
        </div>
     
    </div>
    <!-- ITEM -->

</div>
</template>

<script>
import MyChart from '../components/Chart.vue';
import Tile from '../components/Tile.vue';

export default {
  name: 'App',
  components: {
    MyChart,
    Tile
  },
  data() {
    return {
      chartData: {
        labels: ['Januar', 'Februar', 'März', 'April', 'Mai', "Juni", "Juli", "August"],
        datasets: [
          {
            label: 'Verkäufe',
            //backgroundColor: '#f87979',
            data: [60, 65, 67, 65, 66, 69, 72, 70]
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  }
};
</script>

<style>
#app {
  width: 100%;
  height: 400px;
}
</style>

<template>
  <div style="padding: -10% 0; color: red">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';

export default {
  name: 'MyChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {

    this.createChart();


    /*
    //InternalError: too much recursion
    setInterval(() => {
      let d = 80;
      this.chartData.labels.push(d);
      this.chartData.datasets[0].data.push(d)
    }, 3000);
    */

  },
  methods: {
    createChart() {

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--bs-primary-rgb').trim();

      // Setze die Hintergrundfarbe und die Randfarbe der Datensätze
      this.chartData.datasets[0].backgroundColor = `rgba(${primaryColor}, 1)`;
      this.chartData.datasets[0].borderColor = `rgba(${primaryColor}, 0.2)`;
      this.chartData.datasets[0].borderWidth = 1;
      this.chartData.datasets[0].pointRadius = 3;


      this.chartInstance = new Chart(this.$refs.chartCanvas, {
        type: 'line',
        data: this.chartData,
        options: {
          responsive: true,
          scales: {
            x: {
              display: true
            },
            y: {
              display: false
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });


    }
  }
};
</script>

<style scoped>
/* Optional: CSS für die Chart-Komponente */
div {
  padding: 0 0 !important;
}
</style>

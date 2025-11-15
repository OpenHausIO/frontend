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
    this.renderChart();
  },
  methods: {
    renderChart() {
      // Hole die CSS-Variable und wandle sie in eine RGB-Farbe um
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--bs-primary-rgb')
        .trim(); // Entferne eventuelle Leerzeichen

      // Setze die Hintergrundfarbe und die Randfarbe der Datensätze
      this.chartData.datasets.forEach(dataset => {
        dataset.backgroundColor = `rgba(${primaryColor}, 1)`; // Mit einer Transparenz von 0.5
        dataset.borderColor = `rgba(${primaryColor}, 0.2)`; // Volle Transparenz für den Rand
        dataset.borderWidth = 1; // Setze die Dicke der Linie auf 1px
        dataset.pointRadius = 3;
      });

      this.chartInstance = new Chart(this.$refs.chartCanvas, {
        type: 'line', // Kann zu 'line', 'pie' usw. geändert werden
        data: this.chartData,
        options: {
          ...this.chartOptions,
  responsive: true,
  hover: {
    mode: null // Deaktiviert das Hover-Verhalten
  },
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
  },
  watch: {
    chartData(newData) {
      if (this.chartInstance) {
        this.chartInstance.data = newData;
        this.chartInstance.update();
      }
    }
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
};
</script>

<style scoped>
/* Optional: CSS für die Chart-Komponente */
div{
  padding: 0 0 !important;
}
</style>

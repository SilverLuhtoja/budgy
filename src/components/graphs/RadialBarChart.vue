<script setup>
import { ref, defineProps, onMounted} from 'vue'
import { getActualSpendedPercentageFromPLanned } from '../../utils/graph_scripts';

const { expenditures } = defineProps(['expenditures'])
const series = ref([])
const chartOptions= ref({
            chart: {
              height: 390,
              type: 'radialBar',
            },
            plotOptions: {
              radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                  margin: 5,
                  size: '20%',
                  background: 'transparent',
                  image: undefined,
                },
                dataLabels: {
                  name: {
                    show: false,
                  },
                  value: {
                    show: false,
                  }
                },
                barLabels: {
                  enabled: true,
                  useSeriesColors: true,
                  offsetX: -8,
                  fontSize: '16px',
                  formatter: function(seriesName, opts) {
                    return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + "%"
                  },
                },
              }
            },
            colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
            labels: null,
            responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                    show: true
                }
              }
            }]
          })

onMounted(() => {
    const spendedFromPlannedPercentage = expenditures.map(item => Math.ceil(getActualSpendedPercentageFromPLanned(item.planned_total, item.actual_total)))
    series.value = spendedFromPlannedPercentage
    chartOptions.value.labels = expenditures.map(item => item.name)
})
</script>

<template>
    <div class="pie_chart">
        <h4>Spended from total planned percentage</h4>
        <apexchart type="radialBar" height="390" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<style scoped>
.pie_chart{
  min-width: 32em;
}
</style>
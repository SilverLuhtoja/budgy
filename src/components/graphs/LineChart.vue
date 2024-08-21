<script setup>
import { ref, defineProps, onMounted} from 'vue'

const { expenditures } = defineProps(['expenditures'])
const actual_values = ref([])
const planned_values = ref([])
const series = ref([
        {
            name: "Spended this month",
            data: actual_values
        },
        {
            name: 'Planned monthly total',
            data: planned_values
        }
    ])

const chartOptions = ref({
    chart: {
      height: 360,
      type: 'line',
      zoom: {
        enabled: false
      },
    },
    stroke: {
      width: [3, 4],
      curve: 'straight',
      dashArray: [0, 8],
    //   colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
    },
    title: {
      text: 'Total vs Actual spending',
      align: 'middle'
    },
    legend: {
      tooltipHoverFormatter: function(val, opts) {
        return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>'
      }
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6
      }
    },
    xaxis: {
      categories:null,
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: function (val) {
              return val
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              return val
            }
          }
        }
      ]
    },
    grid: {
      borderColor: '#f1f1f1',
    }
  })

onMounted(() => {
    chartOptions.value.xaxis.categories = expenditures.map(item => item.name)
    actual_values.value =  expenditures.map(item => item.actual_total)
    planned_values.value =  expenditures.map(item => item.planned_total)
})
</script>

<template>
    <main class="line_chart">
        <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
    </main>
</template>

<style scoped>
.line_chart{
  min-width: 32em;
}
</style>

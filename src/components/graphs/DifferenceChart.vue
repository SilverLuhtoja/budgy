<script setup>
import { ref, defineProps, onMounted} from 'vue'

const { current_month_expenditures, last_month_expenditures, months  } = defineProps(['current_month_expenditures', 'last_month_expenditures', 'months'])
const current_month_expendings = ref([])
const last_month_expendings = ref([])
const series = ref([
        {
            name: months[0],
            data: current_month_expendings
        },
        {
            name: months[1],
            data: last_month_expendings
        }
    ])

const chartOptions = ref({
    chart: {
      height: 360,
      type: 'bar',
      zoom: {
        enabled: false
      },
    },
    stroke: {
      width: [1, 2],
      curve: 'straight',
      dashArray: [0, 8],
      colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
    },
    title: {
      text: `${months[0]} VS ${months[1]}`,
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
    chartOptions.value.xaxis.categories = current_month_expenditures.map(item => item.name)
    // console.log(`CURRENT: ${current_month_expenditures}`);
    // console.log(current_month_expenditures);
    // console.log(`LAST:${last_month_expenditures}`);
    // console.log(last_month_expenditures);
    
    current_month_expendings.value = current_month_expenditures.map(item => item.actual_total)
    last_month_expendings.value = last_month_expenditures.map(item => item.actual_total)
    // actual_values.value =  current_month_expenditures.map(item => item.actual_total)
    // planned_values.value =  current_month_expenditures.map(item => item.planned_total)
})
</script>

<template>
    <main class="line_chart">
        <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
    </main>
</template>

<style scoped>
.line_chart{
  min-width: 32em;
}
</style>

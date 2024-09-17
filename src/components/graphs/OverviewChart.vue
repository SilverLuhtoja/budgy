<script setup>
import { ref, defineProps} from 'vue'
import { EST_MONTHS } from '../../utils/file_scripts';

const {month_data, month_total_data} = defineProps(['month_data', 'month_total_data']) 

const series = ref([
        {
        name: "Month total: ",
        data: month_total_data
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
    },
    title: {
      text: `Year Overview`,
      align: 'middle'
    },
    markers: {
      size: 4,
      hover: {
        sizeOffset: 6
      }
    },
    xaxis: {
      categories: EST_MONTHS,
    },
    tooltip: {
      style: {
        fontSize: '30px',
        padding:'2em'
      },
      custom: function({dataPointIndex}) {
        var data = createExpenditureTooltip(month_data[dataPointIndex])
        return data
      },
    },
    grid: {
      borderColor: '#f1f1f1',
    }
  })

const createExpenditureTooltip = (data) => {
  let tooltip_data = ''
  let style = data.length ?  `"
    padding: 2em; 
    font-size:1.2em;
  "` :  ""
  
  Object.values(data).forEach(value => {
    tooltip_data += `<li><b>${value.name}</b>:${+value.actual_total}</li>`
  })
  return `<div style=${style}><uL>${tooltip_data}</uL></div>`
}

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

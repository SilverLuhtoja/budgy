<script setup>
import { ref, defineProps, onMounted} from 'vue'

const { first_month_expenditures, second_month_expenditures, months  } = defineProps(['first_month_expenditures', 'second_month_expenditures', 'months'])
const current_month_expendings = ref([])
const last_month_expendings = ref([])
const series = ref([
        {
            name: months[1],
            data: last_month_expendings
        },
        {
            name: months[0],
            data: current_month_expendings
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
      width: [1, 1],
      curve: 'straight',
      dashArray: [0, 8]
    },
    title: {
      text: `${months[0]} VS ${months[1]}`,
      align: 'middle'
    },
    xaxis: {
      categories:null,
    },
    grid: {
      borderColor: '#f1f1f1',
    }
  })

onMounted(() => {
    chartOptions.value.xaxis.categories = first_month_expenditures.map(item => item.name)
    current_month_expendings.value = first_month_expenditures.map(item => item.actual_total)
    last_month_expendings.value = second_month_expenditures.map(item => item.actual_total)
})
</script>

<template>
    <main class="line_chart">
        <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
    </main>
</template>

<style scoped>
.line_chart{
  min-width: 50em;
}
</style>

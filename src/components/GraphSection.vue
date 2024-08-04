<script setup>
import { ref, defineProps, onMounted} from 'vue'
// import { Chart, Responsive, Pie, Tooltip } from 'vue3-charts'
// import apexchart from 'vueapexcharts';
import { roundUpToDecimalsByTwo } from '../utils/file_process_script';


const { data, expen_settings } = defineProps(['data', 'expen_settings'])
const expenditures = ref({})

const getPlannedSpendingTotal = (total, planned_expending_weight) =>  (total * 0.01) * planned_expending_weight
const getActualSpendedPercentageFromPLanned = (planned_total, spended_total) => (spended_total / planned_total) * 100
 
let  series = ref([])
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

const buildOverView = (data, expen_settings) => {
    let planned_totals = []
    if (data["INCOME"] != undefined || data["INCOME"] == null) {
            let total_income = data["INCOME"].total
            for (let key in  expen_settings){
                let gat_data = {}
                gat_data['name'] = key
                gat_data['planned_percent'] = expen_settings[key]
                gat_data['planned_total'] = roundUpToDecimalsByTwo(getPlannedSpendingTotal(total_income, expen_settings[key]))
                gat_data['actual_percent'] = Math.ceil(data[key].total * 100 / total_income)
                gat_data['actual_total'] = roundUpToDecimalsByTwo(data[key].total)
                gat_data['difference_percent'] = gat_data['planned_percent'] - gat_data['actual_percent']
                gat_data['difference_total'] = roundUpToDecimalsByTwo(gat_data['planned_total'] - gat_data['actual_total'])

                planned_totals.push(gat_data)
             }

             return planned_totals
    }else{
      throw new Error("No income to calculate planned expending totals")
    }
}

onMounted(() => {
    expenditures.value = buildOverView(data, expen_settings)
    series.value = expenditures.value.map(item => Math.ceil(getActualSpendedPercentageFromPLanned(item.planned_total, item.actual_total)))
    chartOptions.value.labels = expenditures.value.map(item => item.name)
})
</script>

<template>
  <section class="flex" >
      <div class="overview_wrapper">
        <h2>OverView</h2>
        <div v-for="item in expenditures" :key="item.name">
          <div class="box">
            <h4>{{ item.name }}</h4>
            <p> Planned expenditure: {{ item.planned_total }} - {{ item.planned_percent }}%</p>
            <p> Actual expenditure: {{ item.actual_total }} - {{ item.actual_percent }}%</p>
            <p :class="item.difference_total > 0 ? 'green' : 'red' "> Difference : {{ item.difference_total }} - {{ item.difference_percent }}%</p>
          </div>
        </div>
      </div>
        <div class="pie_chart">
            <p>Percent used from total</p>
            <apexchart type="radialBar" height="390" :options="chartOptions" :series="series"></apexchart>
        </div>
    </section>
</template>

<style scoped>
.green{
  color: green;
}

.red{
  color: red;
}

.flex{ 
  display: flex;
}

.box{
  border: 2px solid black;
  margin: 0.25em;
  padding: 0.25em;
}

.overview_wrapper{
  margin: 1em;
}

.pie_chart{
  margin-left: 2em;
  width: 36em;
}
</style>
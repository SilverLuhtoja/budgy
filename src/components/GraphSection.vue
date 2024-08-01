<script setup>
import { ref, defineProps, onMounted} from 'vue'
// import { Chart, Responsive, Pie, Tooltip } from 'vue3-charts'
// import apexchart from 'vueapexcharts';

const { data } = defineProps(['data'])

const buildGraphData = (data) => {
    const graph_data = []
    let total_income = 0
    for (let key in  data){
        if (key == "INCOME") {
            total_income = data[key].total
            continue
        }
        let new_object = {}
        new_object['name'] = key
        new_object['percent'] = data[key].total * 100 / total_income
        new_object['total'] = data[key].total
        graph_data.push(new_object)
    }
    return graph_data
}

const monthly_pie_chart_data = ref([])

let  series = ref([76, 67, 61, 120])
let labels = ref(['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'])
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
    monthly_pie_chart_data.value = buildGraphData(data)
    series.value = monthly_pie_chart_data.value.map(item => Math.ceil(item.percent))
    chartOptions.value.labels = monthly_pie_chart_data.value.map(item => item.name)
})
</script>

<template>
    <section >
        <div>
            <p>Percent used from total</p>
            <apexchart type="radialBar" height="390" :options="chartOptions" :series="series"></apexchart>
        </div>
    </section>
</template>

<style scoped>
/* section{
    margin: 1em auto;
    width: 96%;
    color: transparent;
} */
</style>
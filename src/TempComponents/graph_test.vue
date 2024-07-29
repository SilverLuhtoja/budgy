<script setup>
import { ref, defineProps, onMounted} from 'vue'
// import { Chart, Responsive, Pie, Tooltip } from 'vue3-charts'
import VueApexCharts  from 'apexcharts';

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

let  series = [76, 67, 61, 90]
const chartOptions= {
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
            size: '30%',
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
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
            },
        },
        }
    },
    colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
    labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
    responsive: [{
        breakpoint: 480,
        options: {
            legend: {
                show: false
            }
        }
    }]
}

onMounted(() => {
    monthly_pie_chart_data.value = buildGraphData(data)
})
</script>

<template>
    <section >
        <!-- <Responsive class="w-full">
            <template #main="{ width }">
                <Chart
                    direction="circular"
                    :size="{ width, height: 400 }"
                    :data="monthly_pie_chart_data"
                    :margin="{
                    left: Math.round((width - 360)/2),
                    top: 20,
                    right: 0,
                    bottom: 20
                    }"
                    :config="{ controlHover: false }"
                    >
                    <template #layers>
                    <Pie
                        :dataKeys="['name', 'percent']"
                        :pie-style="{ innerRadius: 100, padAngle: 0.03 }" />
                    </template>
                    <template #widgets>
                    <Tooltip
                        :config="{
                        name: { },
                        percent: { },
                        total: { }
                        }"
                        hideLine
                    />
                    </template>
                </Chart>
            </template>
        </Responsive> -->
        <!-- <VueApexCharts  type="radialBar" height="390" :options="chartOptions" :series="series"></VueApexCharts > -->
    </section>
</template>

<style scoped>
section{
    margin: 1em auto;
    width: 96%;
    color: transparent;
}
</style>
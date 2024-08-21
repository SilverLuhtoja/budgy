<script setup>
import { ref, defineProps, onMounted} from 'vue'
import { roundUpToDecimalsByTwo } from '../utils/file_process_script';
import { getPlannedSpendingTotal} from '../utils/graph_scripts';
import RadialBarChart from './graphs/RadialBarChart.vue';
import { EXPENDITURE_SETTINGS_PATH, readFileContents } from '../utils/file_scripts';
import LineChart from './graphs/LineChart.vue';

const { data } = defineProps(['data'])
const expenditures = ref({})
const dataReady = ref(false);

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
    }

    throw new Error("No income to calculate planned expending totals")
}

onMounted(async () => {
    const planned_percentages = JSON.parse(await readFileContents(EXPENDITURE_SETTINGS_PATH))
    const overviewData = buildOverView(data, planned_percentages);
    expenditures.value = overviewData;
    
    dataReady.value = true;
})
</script>

<template>
  <main class="flex" >
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
      <div v-if="dataReady" class="flex">
        <RadialBarChart class="graph" :expenditures="expenditures" />
        <LineChart class="graph" :expenditures="expenditures" />
      </div>
    </main>
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
  min-width: 20em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.342);
}

.graph{
  margin: 1em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.342);
}
</style>
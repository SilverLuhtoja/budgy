<script setup>
import { ref, watch, computed} from 'vue'
import { roundUpToDecimalsByTwo } from '../utils/file_process_script';
import { getLastMonthFilename, getPlannedSpendingTotal} from '../utils/graph_scripts';
import RadialBarChart from './graphs/RadialBarChart.vue';
import { EXPENDITURE_SETTINGS_PATH, extractMonthYear, PROCESSED_FILE_PATH, readFileContents } from '../utils/file_scripts';
import LineChart from './graphs/LineChart.vue';
import DifferenceChart from './graphs/DifferenceChart.vue';
import { useStore } from 'vuex';
import { exists } from '@tauri-apps/api/fs';
import { isEmptyValue } from '../utils/helpers';

const store = useStore();
const currentSelectedFile  = computed(() => store.getters.currentSelectedFile)
const data  = computed(() => store.getters.viewContent)

const months = ref([])
const expenditures = ref({})
const last_month_expenditures = ref({})
const dataReady = ref(false);

const buildOverView = (data, expen_settings) => {
    let planned_totals = []
    if (data["INCOME"] != undefined || data["INCOME"] == null) {
            let total_income = data["INCOME"].total
            for (let key in  expen_settings){
              // dont count in expenditure which key value is 0
              if (data[key] == undefined || expen_settings[key] == 0) continue
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

const getLastMonthData = async () => {
  let lastMonthFilename = getLastMonthFilename(currentSelectedFile.value)
  months.value = [extractMonthYear(currentSelectedFile.value)[0], extractMonthYear(lastMonthFilename)[0] ]
  const path = `${PROCESSED_FILE_PATH}/${lastMonthFilename}`
   if (await exists(path)){
     return JSON.parse(await readFileContents(path));
  }
}


watch(data,
  async (newData) => {
      dataReady.value = false;
      const planned_percentages = JSON.parse(await readFileContents(EXPENDITURE_SETTINGS_PATH));
      const overviewData = buildOverView(newData, planned_percentages);
      expenditures.value = overviewData;

      // Gather last month data
      let lastMonthData = await getLastMonthData()
      if(!isEmptyValue(lastMonthData)){
        last_month_expenditures.value = buildOverView(lastMonthData, planned_percentages);
      }else{
        last_month_expenditures.value = null
      }

      dataReady.value = true;
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <main>
    <div v-if="dataReady" class="flex">
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
        <RadialBarChart class="graph" :expenditures="expenditures" />
        <LineChart class="graph" :expenditures="expenditures" />
        <DifferenceChart v-if="last_month_expenditures" class="graph" :current_month_expenditures="expenditures" :last_month_expenditures="last_month_expenditures" :months="months" />
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
  flex-wrap: wrap;
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
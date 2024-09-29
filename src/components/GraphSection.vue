<script setup>
import { ref, watch, computed} from 'vue'
import { buildOverView, getLastMonthFilename} from '../utils/graph_scripts';
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
            <div class="box" v-if="item.planned_percent != 0">
              <h4>{{ item.name }}</h4>
              <p> Planned expenditure: {{ item.planned_total }} - {{ item.planned_percent }}%</p>
              <p> Actual expenditure: {{ item.actual_total }} - {{ item.actual_percent }}%</p>
              <p class="difference_box" :class="item.difference_total > 0 ? 'green' : 'red' "> Difference : {{ item.difference_total }} EUR > [{{ item.difference_percent }}%]</p>
            </div>
          </div>
        </div>
        <RadialBarChart class="graph" :expenditures="expenditures" />
        <LineChart class="graph" :expenditures="expenditures" />
        <DifferenceChart v-if="last_month_expenditures" class="graph" :first_month_expenditures="expenditures" :second_month_expenditures="last_month_expenditures" :months="months" />
      </div>
    </main>
</template>

<style scoped>

.difference_box{
  color: white;
  padding: 0.2em;
  font-weight: 900;
}

.green{
  background: rgba(0, 128, 0, 0.7);
}

.red{
  background: rgba(255, 0, 0, 0.7);
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
.box h4{
  margin-bottom: 0.3em;
  text-decoration: underline;
}

.box p{
  margin-bottom: 0.2em;
}

.overview_wrapper{
  margin: 1em;
  padding: 0.3em;
  min-width: 20em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.342);
  background: rgba(255, 255, 255, 0.6);
}

.graph{
  margin: 1em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.342);
  background: rgba(255, 255, 255, 0.6);
}
</style>

<script setup>
import { onMounted, ref, watch } from 'vue';
import OverViewChart from './graphs/OverviewChart.vue';
import { buildOverView, getMonthData, getProcessedAvailableYears } from '../utils/graph_scripts';
import { EST_MONTHS, EXPENDITURE_SETTINGS_PATH, PROCESSED_FILE_PATH, readDirPath, readFileContents } from '../utils/file_scripts';
import LineChart from './graphs/LineChart.vue';
import { exists } from '@tauri-apps/api/fs';

const current_year = ref(new Date().getFullYear())
const availableProcessedYears = ref([])
const month_data = ref(Array(12).fill([]))
const month_total_data = ref(Array(12).fill(0))
const processed_files = ref([])
const first_option_month_path = ref("")
const second_option_month_path  = ref("")
const first_option_month_data = ref("")
const second_option_month_data = ref("")

const calculateCategoryTotal = (data) => {
    let total = 0
   for (let category of Object.keys(data)){
        if(category != "INCOME"){
            total += data[category].total
        }
   }
       
    return total
}

const getProcessedFiles = async () => {
    processed_files.value = await readDirPath(PROCESSED_FILE_PATH);
}

const buildYearGraph = async () => {
    month_data.value.fill([])
    month_total_data.value.fill(0)
    const planned_percentages = JSON.parse(await readFileContents(EXPENDITURE_SETTINGS_PATH));
    
    EST_MONTHS.forEach(async (month, idx) => {
        const data = await getMonthData(month, current_year.value)
        if (data == undefined)  return
        const month_expenditure = buildOverView(data, planned_percentages)
        const month_expenditure_total = calculateCategoryTotal(data)
        month_data.value[idx] = month_expenditure
        month_total_data.value[idx] = month_expenditure_total
    })
}

const getMonthGraphData = async (path, option) => {
   if (await exists(path)){
    const planned_percentages = JSON.parse(await readFileContents(EXPENDITURE_SETTINGS_PATH));
    let data = JSON.parse(await readFileContents(path));
    if (option == "first"){
        first_option_month_data.value = buildOverView(data, planned_percentages);
    } else {
        second_option_month_data.value = buildOverView(data, planned_percentages);
    }
  }
}

const exludeOthenMonthFile = (path) => {
    if (path == null || path == undefined) return
    return processed_files.value.filter(file => path.split('/').slice(-1) != file.name)
}

onMounted(async () => {
    await getProcessedFiles()
    await buildYearGraph()
    availableProcessedYears.value = await getProcessedAvailableYears()
})

watch(current_year, async() => {
    await buildYearGraph()
} )

watch([first_option_month_path,second_option_month_path], async() => {
    first_option_month_data.value = ""
    second_option_month_data.value = ""
    await getMonthGraphData(first_option_month_path.value, 'first')
    await getMonthGraphData(second_option_month_path.value, 'second')
} )
</script>

<template>
    <div>
         <h3> OVERVIEW - {{ current_year }} </h3>
         <div class="flex" >
            <button v-for="year in availableProcessedYears" :key="year" @click="current_year = year"> {{year}} </button>
        </div>
        <OverViewChart :month_data="month_data" :month_total_data="month_total_data"/>
    </div>

    <div>
        <h3> COMPARE MONTH to MONTH </h3>
        <div class="flex">
            <div class="graph_box">
                <select v-model="first_option_month_path">
                    <option v-for="file in exludeOthenMonthFile(second_option_month_path)" :value="file.path">{{file.name}}</option>
                </select>
                <LineChart  class="graph" v-if="first_option_month_data && second_option_month_data" :expenditures="first_option_month_data"/> 
            </div>
            <p>VS</p>
            <div class="graph_box">
                <select v-model="second_option_month_path">
                    <option v-for="file in exludeOthenMonthFile(first_option_month_path)" :value="file.path">{{file.name}}</option>
                </select>
                <LineChart  class="graph" v-if="first_option_month_data && second_option_month_data" :expenditures="second_option_month_data"/> 
            </div>
        </div>

      
    </div>
</template>

<style scoped>
.flex {
    display: flex;
    align-items: center;

}
.flex button {
    width: 4em;
    margin: 0.2em;
}

.graph{
  margin: 1em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.342);
}

.graph_box{
    text-align: center
}
</style>

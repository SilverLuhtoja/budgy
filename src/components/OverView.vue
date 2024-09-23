<script setup>
import { onMounted, ref, watch } from 'vue';
import OverViewChart from './graphs/OverviewChart.vue';
import DifferenceChart from './graphs/DifferenceChart.vue';
import { buildOverView, getMonthData, getProcessedAvailableYears } from '../utils/graph_scripts';
import { EST_MONTHS, EXPENDITURE_SETTINGS_PATH, extractMonthYear, PROCESSED_FILE_PATH, readDirPath, readFileContents } from '../utils/file_scripts';
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
    <section class="overview_wrapper">
        <div class="overview_graph">
            <h3> OVERVIEW - {{ current_year }} </h3>
            <div class="flex" >
                <button v-for="year in availableProcessedYears" :key="year" @click="current_year = year"> {{year}} </button>
            </div>
            <OverViewChart :month_data="month_data" :month_total_data="month_total_data"/>
        </div>
        
        <div class="comparison_box">
            <h3> COMPARE MONTH to MONTH </h3>
            <div class="flex">
                <select v-model="first_option_month_path">
                    <option v-for="file in exludeOthenMonthFile(second_option_month_path)" :value="file.path">{{file.name}}</option>
                </select>
                <DifferenceChart v-if="first_option_month_data && second_option_month_data" class="graph" 
                    :first_month_expenditures="first_option_month_data" 
                    :second_month_expenditures="second_option_month_data" 
                    :months="[extractMonthYear(first_option_month_path)[0], extractMonthYear(second_option_month_path)[0]]" 
                />
                <div class="graph flex" v-else>Select Months To Show Graph</div>
                <select v-model="second_option_month_path">
                    <option v-for="file in exludeOthenMonthFile(first_option_month_path)" :value="file.path">{{file.name}}</option>
                </select>
            </div>
        </div>
    </section>
</template>

<style scoped>
.overview_wrapper {
    display: flex;
    flex-direction: column;
    place-items: center;
}

.overview_graph, .comparison_box{
    width: 84vw;
    padding: 1em;
    background: rgba(148, 181, 182, 0.911);
}

.comparison_box .flex {
    display: flex;
    justify-content: center;
    place-items: center;
}

.flex button {
    width: 4em;
    margin: 0.2em;
}

select {
    padding: 0.5em;
}

.comparison_box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    place-items: center;
    text-align: center;
    margin-top: 2em;
}

.comparison_box .flex select{
    margin: 2em;
}

.graph{
  margin: 1em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.342);
  width: 800px;
  height: 400px;
}
</style>

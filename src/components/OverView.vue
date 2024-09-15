<script setup>
import { onMounted, ref } from 'vue';
import OverViewChart from './graphs/OverviewChart.vue';
import { buildOverView, getMonthData } from '../utils/graph_scripts';
import { EST_MONTHS, EXPENDITURE_SETTINGS_PATH, readFileContents } from '../utils/file_scripts';

const current_year = new Date().getFullYear() 
const month_data = ref(Array(12).fill([]))
const month_total_data = ref(Array(12).fill(0))

const calculateCategoryTotal = (data) => {
    let total = 0
   for (let category of Object.keys(data)){
        if(category != "INCOME"){
            total += data[category].total
        }
   }
       
    return total
}

onMounted(async () => {
    const planned_percentages = JSON.parse(await readFileContents(EXPENDITURE_SETTINGS_PATH));
    
    EST_MONTHS.forEach(async (month, idx) => {
        const data = await getMonthData(month, current_year)
        if (data == undefined)  return
        const month_expenditure = buildOverView(data, planned_percentages)
        const month_expenditure_total = calculateCategoryTotal(data)
        month_data.value[idx] = month_expenditure
        month_total_data.value[idx] = month_expenditure_total
    })
})
</script>

<template>
    <div>
        OVERVIEW - {{ current_year }}
        <div>
            <button> 2023 </button>
            <button> 2024 </button>
        </div>
        <OverViewChart :month_data="month_data" :month_total_data="month_total_data"/>
    </div>
</template>

<style scoped>
</style>

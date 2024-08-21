<script setup>
import { onMounted,ref } from 'vue';
import { CONFIGURATIONS_FILE_PATH, EXPENDITURE_SETTINGS_PATH } from '../utils/file_scripts';
import { write_file, read_file } from '../utils/rust_file_scripts';
import { isObjEmpty } from '../utils/helpers';

const configurations = ref({})
const category_name = ref("");
const expenditure_configs = ref([])
const expenditure_total = ref(0)
const not_included_expenditures = ["saved-options", "INCOME"]

const onSaveHandler = async () => {
    const savedConfigurations = {};
    for (const key in configurations.value) {
        const values = configurations.value[key];
        
        if (typeof values == "object" && !isObjEmpty(values) ) return

        if (!values == "" && !isObjEmpty(values)) {
            savedConfigurations[key] = configurations.value[key].split(',').map(item => item.trim());
            configurations.value[key] = savedConfigurations[key].join(', ');
        }else{
            savedConfigurations[key] = []
        }
    }
    await write_file(CONFIGURATIONS_FILE_PATH, savedConfigurations)
    updateExpenditureOptions()
}

const onExpenditureSaveHandler = () => {
    const savedConfigurations = {};
    for (const key of Object.entries(expenditure_configs.value)) {
        savedConfigurations[key[0]] = Number(key[1])
    }
    write_file(EXPENDITURE_SETTINGS_PATH, savedConfigurations) 
}

const removeCategoryHandler = (category) => {
    delete configurations.value[category];
}

const addCategoryHandler = () => {
    if (!configurations.value[category_name]) {
        configurations.value[category_name.value] = []
    }
    category_name.value = ""
}

const updateExpenditureOptions = async () => {
    let configs = JSON.parse(await read_file(CONFIGURATIONS_FILE_PATH))
    let expenditures = JSON.parse(await read_file(EXPENDITURE_SETTINGS_PATH))
    let new_configs = {}
    
    Object.keys(configs).forEach(key => {
        if (!not_included_expenditures.includes(key)){
            if (expenditures[key] != 0 && expenditures[key] != undefined) {
                new_configs[key] = expenditures[key]
            }else{
                new_configs[key] = 0
            }
        }
    });
    
    write_file(EXPENDITURE_SETTINGS_PATH, new_configs) 
    expenditure_configs.value = new_configs
}  

const calculateExpenditureTotal = () => {
    if (isObjEmpty(expenditure_configs.value)) return
    return Object.values(expenditure_configs.value).reduce((a,b) => Number(a) + Number(b));
}

const onExpenditureChange = (event) => {
    const key = event.target.parentElement.firstChild.innerHTML.replaceAll("amp;","")
    const value = event.target.value;
    
    if (isNaN(value)) {
        expenditure_configs.value[key] = Number(value.slice(0,-1))
        return
    }

    expenditure_total.value = calculateExpenditureTotal()
    if(Number(value) > 100) {
        return
    }
    expenditure_configs.value[key] = Number(value)
}

const formatConfigurationValues = () => {
     for (const key in configurations.value ) {
        configurations.value[key] = configurations.value[key].join(', ');
    }
}

onMounted( async () => {
    let configs = JSON.parse(await read_file(CONFIGURATIONS_FILE_PATH))
    configurations.value = configs
    formatConfigurationValues()
    await updateExpenditureOptions()
    expenditure_total.value = calculateExpenditureTotal()
})
 

</script>

<template>
    <section class="filter_settings">
        <h3> Filter configurations </h3>

        <div class="add_category_wrapper">
            <input v-model="category_name" placeholder="Enter a category name..." />
            <button @click="addCategoryHandler">add category</button>
        </div>

        <div class="flex category" v-for="(value,key) in configurations" :key="key">
            <div v-if="key != 'saved-options'" class="flex center category_key">
                <div class="category_name flex">
                    <button class="remove_category_btn" @click="removeCategoryHandler(key)" > - </button>
                    <div class="key"> {{ key }}</div>
                </div>
                <textarea  v-model="configurations[key]" class="value">{{value}}</textarea>
            </div>
            <div v-else class="flex center">
                <div>QuickSavedOptions:</div>
                <div class="saved_option" v-for="item in value.split(',')">
                    {{ item }}
                </div>
            </div>
        </div>

        <button class="save_btn" @click="onSaveHandler" > SAVE </button>
    </section>

    <div class="section_divider"></div>
    <section class="expenditure_settings">
        <h3>Expenditure settings</h3>
        <p> Total: {{ expenditure_total <= 100 ? expenditure_total + "%": "Change values, cant be over 100%" }}  </p>
        <div  v-for="key,value in Object.entries(expenditure_configs)" :key="value">
            <div class="flex category">
                <div class="key"> {{ key[0] }}</div> 
                <input class="expenditure_value" v-model="expenditure_configs[key[0]]" @input="onExpenditureChange">% 
            </div>
        </div>
        <button class="save_btn" v-if="expenditure_total <= 100" @click="onExpenditureSaveHandler"> SAVE </button>
    </section>
</template>

<style scoped>

.flex{
    display: flex;
}

.expenditure_settings, .filter_settings{
    margin: 1em;
}

.center {
    justify-content: center;
    align-items: center;
}

.category{
    background-color: rgba(250, 235, 215, 0.829);
    border: 4px solid rgba(250, 215, 169, 0.801);
}

.category_name{
    width: 14em;
}

.category_key{
    padding: 0.5em;
}

.value {
    margin-left: 2em;
    padding: 0.5em;
    min-width: 50em;
    min-height: 3em;
}

.save_btn{
    background: rgb(131, 206, 108);
    margin: 0.3em 0;
    padding: 0.5em;
    border: hidden;
}

.save_btn:hover{
    background: rgb(128, 240, 128);
    box-shadow: 1px 1px 2px black;
}

.remove_category_btn{
    padding: 0 0.5em;
    margin-right:  0.5em;
    background: rgb(241, 128, 34);
    border: hidden;
}
.remove_category_btn:hover{
    background: rgb(255, 159, 80);
    box-shadow: 1px 1px 2px black;
}

.add_category_wrapper{
    margin:  0.5em 0;
}

.add_category_wrapper input, button {
    padding: 0.3em;
}

.add_category_wrapper  button {
    background: rgb(131, 206, 108);
}

.add_category_wrapper  button:hover{
    background: rgb(128, 240, 128);
    box-shadow: 1px 1px 2px black;
}

.saved_option{
    background: rgb(166, 236, 248);
    padding: 0.3em;
    border: 1px solid black;
    margin: 0.5em;
}

.section_divider{
    height: 5px;
    background: rgb(39, 63, 39);
    margin: 0 auto;
    width: 100%;
    margin-top: 3em;
}

.expenditure_settings p{
    margin: 0.5em 0;
}

.expenditure_settings .key{
    min-width: 14em;
}

.expenditure_settings .category {
    padding: 0.5em;
}
.expenditure_value{
    width: 3em;
    margin-left: 1em;
}
</style>

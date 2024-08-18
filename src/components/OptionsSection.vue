<script setup>
import { onMounted,ref } from 'vue';
import { CONFIGURATIONS_FILE_PATH, EXPENDITURE_SETTINGS_PATH } from '../utils/file_scripts';
import { write_file, read_file } from '../utils/rust_file_scripts';
import { isObjEmpty } from '../utils/helpers';

const configurations = ref({})
const category_name = ref("");
const expenditure_configs = ref([])
const expenditure_total = ref(0)

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
        if (key != "saved-options"){
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
    const key = event.target.parentElement.firstChild.innerHTML
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
    <section>
        <h1> Filter configurations </h1>

        <div class="add_category_wrapper">
            <input v-model="category_name" placeholder="Enter a category name..." />
            <button @click="addCategoryHandler">add category</button>
        </div>

        <div class="flex category" v-for="(value,key) in configurations" :key="key">
            <div v-if="key != 'saved-options'" class="flex center category_key">
                <div >
                    <button class="remove_category_btn" @click="removeCategoryHandler(key)" > x </button>
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

        <div class="section_divider"></div>
        <section>
            <h1> AS IT IS SMALLER FUNCTIONALITY TRY IMPLEMENTING RUST</h1>
            <h1>Expenditure settings</h1>
            <p> Total: {{ expenditure_total < 100 ? expenditure_total : "Change values, cant be over 100%" }} % </p>
            <div  v-for="key,value in Object.entries(expenditure_configs)" :key="value">
                <div class="flex category">
                    <div class="key"> {{ key[0] }}</div> 
                    <input class="expenditure_value" v-model="expenditure_configs[key[0]]" @input="onExpenditureChange">% 
                </div>
            </div>
            <button v-if="expenditure_total <= 100" class="save_btn" @click="onExpenditureSaveHandler"> SAVE </button>
        </section>
    </section>
</template>

<style scoped>

.flex{
    display: flex;
}

.center {
    justify-content: center;
    align-items: center;
}

.category{
    padding:0.5em 1em;
    background-color: antiquewhite;
    border-bottom: 2px solid rgb(250, 215, 169);
}
.category_key{
    padding: 0.5em;
}

.value {
    margin-left: 2em;
    padding: 0.5em;
    min-width: 30em;
    min-height: 6em;
}

.save_btn{
    background: rgb(139, 212, 139);
    padding: 0.5em;
}

.remove_category_btn{
    padding: 0 0.25em;
    margin-right:  0.5em;
    background: rgb(226, 121, 35);
}

.add_category_wrapper{
    margin:  0.5em 0.25em;
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
    width: 96%;
    margin-top: 3em;
}

.expenditure_value{
    width: 3em;
    margin-left: 1em;
}
</style>

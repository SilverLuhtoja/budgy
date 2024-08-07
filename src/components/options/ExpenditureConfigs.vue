<script setup>
import { onMounted, ref, defineProps } from 'vue';
import { getExpenditureConfigurations, saveExpenditureConfigurations } from '../../utils/file_scripts';

const {configurations} = defineProps(['configurations'])
const expenditure_configs = ref("")
const expenditure_total = ref(0)

const onExpenditureSaveHandler = () => {
    const savedConfigurations = {};
    for (const key of Object.entries(expenditure_configs.value)) {
        savedConfigurations[key[0]] = Number(key[1])
    }
    saveExpenditureConfigurations(savedConfigurations);
}

const getExpenditureOptions = async (data) => {
    let configs = JSON.parse(await getExpenditureConfigurations())
    let new_configs = {}
    
    if (Object.keys(configs).length !== 0 ) return configs
    Object.keys(data).forEach(element => {
        if (element != "saved-options"){
            new_configs[element] = 0
        }
    });
    await saveExpenditureConfigurations(new_configs)
    
    return new_configs
}  

const calculateExpenditureTotal = () => {
    return Object.values(expenditure_configs.value).reduce((a,b) => Number(a) + Number(b));
}

const onExpenditureChange = (event) => {
    let key = event.target.parentElement.firstChild.innerHTML.replaceAll("amp;","")
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

onMounted( async () => {
    expenditure_configs.value = await getExpenditureOptions(configurations)
    expenditure_total.value = calculateExpenditureTotal()
})

</script>

<template>
    <section>
        <h1> AS IT IS SMALLER FUNCTIONALITY TRY IMPLEMENTING RUST</h1>
        <h1>Expenditure settings</h1>
        <p> Total: {{ expenditure_total <= 100 ? expenditure_total : "Change values, cant be over 100%" }} % </p>
        <div  v-for="key,value in Object.entries(expenditure_configs)" :key="value">
            <div class="flex category">
                <div class="key"> {{ key[0] }}</div> 
                <input class="expenditure_value" v-model="expenditure_configs[key[0]]" @input="onExpenditureChange">% 
            </div>
        </div>
        <button v-if="expenditure_total <= 100" class="save_btn" @click="onExpenditureSaveHandler"> SAVE </button>
    </section>
</template>

<style scoped>
.flex{
    display: flex;
}

.category{
    padding:0.5em 1em;
    background-color: antiquewhite;
    border-bottom: 2px solid rgb(250, 215, 169);
}

.save_btn{
    background: rgb(139, 212, 139);
    padding: 0.5em;
}

.expenditure_value{
    width: 3em;
    margin-left: 1em;
}
</style>
<script setup>
import { onMounted, ref } from 'vue';
import { saveConfigurationFile, getConfigurations } from '../utils/file_scripts';
import ExpenditureConfigs from './options/ExpenditureConfigs.vue';

const configurations = ref(null)
const category_name = ref("");

const onSaveHandler = () => {
    const savedConfigurations = {};
    for (const key in configurations.value) {
        if (!configurations.value[key] == "") {
            savedConfigurations[key] = configurations.value[key].split(',').map(item => item.trim());
        }else{
            savedConfigurations[key] = []
        }
    }
    saveConfigurationFile(savedConfigurations);
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

onMounted( async () => {
    configurations.value = JSON.parse(await getConfigurations())
     for (const key in configurations.value ) {
        configurations.value[key] = configurations.value [key].join(', ');
    }
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
        
        <ExpenditureConfigs :configurations="configurations" />
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
</style>

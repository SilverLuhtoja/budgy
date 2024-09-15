<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { saveConfigurationFile, getConfigurations, CONFIGURATIONS_FILE_PATH } from '../utils/file_scripts';
import GraphSection from './GraphSection.vue';
import { write_file } from '../utils/rust_file_scripts';
import { useStore } from 'vuex';

const store = useStore();
const visibleDetails = ref([]);
const spendingDetails = ref([]);
const pressedKeys = ref(new Set());
const currentSelectedFile  = computed(() => store.getters.currentSelectedFile)
const content = computed(() => store.getters.viewContent)

const isPlainObject = (value) => {
    return Object.prototype.toString.call(value) === '[object Object]';
};

const toggleDetails = (category) => {
    if (visibleDetails.value.includes(category)) {
        visibleDetails.value = visibleDetails.value.filter(item => item !== category);
        return
    } 
    
    visibleDetails.value.push(category);
};

const toggleMoreDetails = (key) => {
    if (spendingDetails.value.includes(key)) {
        spendingDetails.value = spendingDetails.value.filter(item => item !== key);
        return
    } 
    
    spendingDetails.value.push(key);
};

const closeVisibleDetails = () => { visibleDetails.value = []}

const openDetails = () => { 
    for (let category of Object.keys(content)){
       visibleDetails.value.push(category);
    }
}

const handleKeyDown = (event) => {
  pressedKeys.value.add(event.key);
  if (pressedKeys.value.has('Shift') && pressedKeys.value.has('A')) {
    console.log('Shift+A combination detected');
    quickSaveHighlightedText()
  }
}

const  handleKeyUp = (event) => {
  pressedKeys.value.delete(event.key);
  console.log('Keys released:', [...pressedKeys.value]);
}

const quickSaveHighlightedText = async () => {
    const saveable = window.getSelection().toString()
    if (saveable == "") return

    let configurations = JSON.parse(await getConfigurations())
    let values = configurations['saved-options']
    if (values === undefined) {
        configurations['saved-options'] = [saveable]
        write_file(CONFIGURATIONS_FILE_PATH, configurations)
        return
    }
    
    if (!values.includes(saveable))values.push(saveable)
    configurations['saved-options'] = values
    saveConfigurationFile(configurations);
}

const calculateCategoryTotal = () => {
    let total = 0
   for (let category of Object.keys(content.value)){
        if(category != "INCOME"){
            total += content.value[category].total
        }
   }
       
    return total
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});
</script>

<template>
    <main v-if="isPlainObject(content)">
        <h1 v-if="currentSelectedFile" class="month">
            {{ currentSelectedFile.toUpperCase() }}
        </h1>
        <div class="flex">
            <button class="option_btn" @click="closeVisibleDetails">Close All Details</button>
            <button class="option_btn" @click="openDetails">Open All Details</button>
            <p class="info">Shift+A to quick save highlighted text to options</p>
        </div>
        <br>
        <h2> Total spent: {{ calculateCategoryTotal() }}</h2>
        <div class="category_card" v-for="[category, value] in Object.entries(content)" :key="category">
            <div class="flex">
                <button  class="toggle_btn" @click="toggleDetails(category)">{{visibleDetails.includes(category) ? "\\/" : ">"}}</button>
                <h2> {{ category }} : {{ value['total'] }} </h2>
            </div>
            <div v-if="visibleDetails.includes(category)">
                <div class="hide" v-for="[key, val] in Object.entries(value)" :key="key">
                    <div v-if="Array.isArray(val)">
                        <h4> {{ key }}: </h4>
                        <div class="item" v-for="item in val" :key="item[1]+'_'+item[2]"> <div>
                                <div class="flex" @click="toggleMoreDetails(item[1])">
                                    <p > {{item[1]}} </p>
                                    <p> -- {{item[3]}} EUR ({{ item[4] }})</p>
                                </div>
                                <div v-if="spendingDetails.includes(item[1])">
                                    <p>date: {{item[0]}}</p>
                                    <p>description: {{item[2]}}</p>
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div v-else class="flex"> <h4> {{ key }}: </h4> {{ val }} </div>
                </div>
            </div>
        </div>

        <!-- GRAPHS -->
        <div class="section_divider"></div>
        <GraphSection />
    </main>
    <pre v-else> {{ content }} </pre>
</template>

<style scoped>
.flex{
    display: flex;
}

.month{
    text-decoration: underline;
    margin: 0.5em;
}

.category_card{
    margin: 1em 0.3em;
    padding: 0.25em;
    background: rgb(216, 216, 216);
}

.option_btn{
    margin: 0 0.3em;
    padding: 0.5em 1em;
}

.info{
    color: rgb(241, 206, 7);
    background: rgb(90, 90, 90);
    padding: 0.5em 1em;
}

.item{
    margin: 1em;
    cursor: pointer;
    padding: 0.3em;
    background: rgb(180, 180, 180);
}

.item:hover{
    background: rgb(134, 134, 134);
}

.section_divider{
    height: 5px;
    background: rgb(39, 63, 39);
    margin: 0 auto;
    width: 100%;
}

.toggle_btn{
    padding: 0.3em;
    margin-right: 0.3em;
}
</style>

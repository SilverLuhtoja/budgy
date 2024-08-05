<script setup>
import { onMounted, onBeforeUnmount, defineProps, ref } from 'vue';
import { saveConfigurationFile, getConfigurations } from '../utils/file_scripts';
import GraphSection from './GraphSection.vue';

const props = defineProps(['content'])
const visibleDetails = ref([]);
const pressedKeys = ref(new Set());

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

const closeVisibleDetails = () => { visibleDetails.value = []}

const openDetails = () => { 
    for (let category of Object.keys(props.content)){
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
    if (!values.includes(saveable))values.push(saveable)
    configurations['saved-options'] = values
    saveConfigurationFile(configurations);
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
    <div v-if="isPlainObject(props.content)">
        <div class="flex">
            <button class="option_btn" @click="closeVisibleDetails">Close All Details</button>
            <button class="option_btn" @click="openDetails">Open All Details</button>
            <p class="info">Shift+A to quick save highlighted text to options</p>
        </div>
        <div class="category_card" v-for="[category, value] in Object.entries(props.content)" :key="category">
            <div class="flex">
                <button @click="toggleDetails(category)">></button>
                <h2> {{ category }} : {{ value['total'] }} </h2>
            </div>
            <div v-if="visibleDetails.includes(category)">
                <div class="hide" v-for="[key, val] in Object.entries(value)" :key="key">
                    <div v-if="Array.isArray(val)">
                        <h4> {{ key }}: </h4>
                        <div v-for="item in val" :key="item"> {{ item }} </div>
                    </div>
                    <div v-else class="flex"> <h4> {{ key }}: </h4> {{ val }} </div>
                </div>
            </div>
        </div>

        <!-- GRAPHS -->
        <div class="section_divider"></div>
        <GraphSection :data="props.content" />
    </div>
    <pre v-else> {{ props.content }} </pre>
    
</template>

<style scoped>
.flex{
    display: flex;
}

.category_card{
    margin: 1em 0.3em;
    padding: 0.25em;
    background: rgb(189, 189, 189);
}

.option_btn{
    margin: 0 0.3em;
}

.info{
    color: rgb(241, 206, 7);
    background: rgb(90, 90, 90);
    padding: 0.5em 1em;
}

.section_divider{
    height: 5px;
    background: rgb(39, 63, 39);
    margin: 0 auto;
    width: 96%;
}
</style>
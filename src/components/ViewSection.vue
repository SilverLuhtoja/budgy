<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps(['content'])
const visibleDetails = ref([]);
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
</script>

<template>
    <div class="view_panel">
        <h1> View Window </h1> 
        <div v-if="props.content && props.content.length && Array.isArray(props.content)" v-for="line,idx in props.content" :key="idx">
            {{ line }}
        </div>
        <div v-else >
            <!-- TODO: REFACTOR TO SEPRATE COMOPONENT -->
            <div v-if="isPlainObject(props.content)">
                <div class="flex">
                    <button @click="closeVisibleDetails">Close All Details</button>
                    <button @click="openDetails">Open All Details</button>
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
            </div>
            <pre v-else> {{ props.content }} </pre>
        </div>
    </div>
</template>

<style scoped>
.view_panel{
    width: 100%;
    height: 100vh;
    overflow: auto;
}

.flex{
    display: flex;
}

.category_card{
    margin: 1em 0.3em;
    padding: 0.25em;
    background: rgb(189, 189, 189);
}
</style>
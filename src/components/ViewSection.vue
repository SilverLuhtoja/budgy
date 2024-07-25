<script setup>
import { defineProps, ref, computed } from 'vue';
import { useStore } from 'vuex';
import OptionsSection from './OptionsSection.vue'

const store = useStore();
const currentView = computed(() => store.getters.currentView)

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
        <section v-if="currentView == 'default'">
            <h1> View Window </h1>
            <div v-if="props.content && props.content.length && Array.isArray(props.content)" v-for="line,idx in props.content" :key="idx">
                {{ line }}
            </div>
            <div v-else >
                <!-- TODO: REFACTOR TO SEPRATE COMOPONENT -->
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
                </div>
                <pre v-else> {{ props.content }} </pre>
            </div>
        </section>
        <section v-if="currentView == 'options'">
            <OptionsSection />
        </section>
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

.option_btn{
    margin: 0 0.3em;
}

.info{
    color: rgb(241, 206, 7);
    background: rgb(90, 90, 90);
    padding: 0.5em 1em;
}
</style>
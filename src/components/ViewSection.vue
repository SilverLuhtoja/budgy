<script setup>
import { defineProps, computed } from 'vue';
import { useStore } from 'vuex';
import OptionsSection from './OptionsSection.vue'
import { Views } from '../stores/store.js'
import ProcessedFileView from './ProcessedFileView.vue';

const store = useStore();
const currentView = computed(() => store.getters.currentView)
const props = defineProps(['content'])
</script>

<template>
    <div class="view_panel">
        <section v-if="currentView == Views.DEFAULT">
            <h1> View Window </h1>
            <div v-if="props.content && props.content.length && Array.isArray(props.content)" v-for="line,idx in props.content" :key="idx">
                {{ line }}
            </div>
            <div v-else >
                <ProcessedFileView :content="props.content" />
            </div>
        </section>
        <section v-if="currentView == Views.OPTIONS">
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
</style>
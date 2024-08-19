<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { Views } from '../stores/store.js'
import OptionsSection from './OptionsSection.vue'
import ProcessedFileView from './ProcessedFileView.vue';

const store = useStore();
const currentView = computed(() => store.getters.currentView)
const content = computed(() => store.getters.viewContent)
</script>

<template>
    <div class="view_panel">
        <section v-if="currentView == Views.DEFAULT">
            <h1> View Window </h1>
            <div v-if="content && content.length && Array.isArray(content)" v-for="line,idx in content" :key="idx">
                {{ line }}
            </div>
            <div v-else >
                <ProcessedFileView :content="content" />
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
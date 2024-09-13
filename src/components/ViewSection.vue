<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { Views } from '../stores/store.js'
import OptionsView from './OptionsView.vue'
import OverView from './OverView.vue'
import ProcessedFileView from './ProcessedFileView.vue';

const store = useStore();
const currentView = computed(() => store.getters.currentView)
const content = computed(() => store.getters.viewContent)
</script>

<template>
    <main class="view_panel">
        <section v-if="currentView == Views.DEFAULT">
            <div v-if="content && content.length && Array.isArray(content)" v-for="line,idx in content" :key="idx">
                {{ line }}
            </div>
            <div v-else >
                <ProcessedFileView />
            </div>
        </section>
        <section v-if="currentView == Views.OPTIONS">
            <OptionsView />
        </section>
        <section v-if="currentView == Views.OVERVIEW">
            <OverView />
        </section>
    </main>
</template>

<style scoped>
.view_panel{
    width: 100vw;
    margin: 1em;
    margin-left: 14vw;
}
</style>
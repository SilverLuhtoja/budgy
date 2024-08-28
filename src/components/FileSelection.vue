<script setup>
import { defineProps, ref, computed } from 'vue';
import { useStore } from 'vuex';
const props = defineProps(['sectionName', 'files', 'readFile']);
const sectionClicked = ref(false)

const store = useStore();
const currentlySelectedFile  = computed(() => store.getters.currentSelectedFile)

</script>

<template>
    <main>
        <p class="flex" @click="sectionClicked = !sectionClicked"> {{props.sectionName}} FILES <pre> {{ !sectionClicked ? '>' : "\\/"}} </pre></p>
        <div
            v-if="sectionClicked"
            v-for="file in props.files"
            :key="file.name"
            >
            <p
            :class="{ selected: currentlySelectedFile === file.name }"
            class="file"
            @click="readFile(file.path, file.name)"
            >
            - {{ file.name }}
        </p>
        </div>
    </main>
</template>

<style scoped>
.flex {
  display: flex;
}

.file {
  padding: 0.25em 1em;
}

.selected {
  background: rgb(216, 169, 169);
}

.file:hover {
  cursor: grab;
  background: rgb(173, 135, 135);
}

.file_panel section > div{
  margin: 0.5em 1em;
}
</style>
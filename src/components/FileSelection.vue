<script setup>
import { defineProps, ref } from 'vue';
const props = defineProps(['sectionName', 'files', 'readFile', 'currentlySelectedFile']);
const sectionClicked = ref(false)
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
            :class="{ selected: props.currentlySelectedFile === file.name }"
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
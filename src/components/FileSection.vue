<script setup>
import { onMounted, onUnmounted, defineProps, ref } from 'vue';
import { getFileName, readFileContents } from '../utils/file_scripts';
import ProcessSection from '../components/ProcessSection.vue';

const props = defineProps(['originalFiles', 'processedFiles', 'showOnViewSection']);
const currentlySelectedFile = ref('');
const processClicked = ref(false);
const fileContent = ref('');
const processedFilename = ref('')

const readFile = async (path = null, filename) => {
  currentlySelectedFile.value = filename;
  let content = await readFileContents(path);

  if (!path.includes("processed_files")) {
    fileContent.value = content.split("\n");
  }else{
    fileContent.value = JSON.parse(content)
  }
  processedFilename.value = getFileName(path).split('.')[0]
  props.showOnViewSection(fileContent.value);
};

const onClickOutside = e => {
  const notProcessedFile = currentlySelectedFile.value.split('.').length != 1
  if (!e.target.classList.contains('file') && !processClicked.value && notProcessedFile) {
    currentlySelectedFile.value = '';
    // fileContent.value = ''
    props.showOnViewSection('');
  }
};

const switchProcessClicked = () => {
  processClicked.value = !processClicked.value;
};

const isCSVFile = () => {
  return currentlySelectedFile.value.split('.').pop() === "csv"
}

onMounted(() => {
  window.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', onClickOutside);
});
</script>

<template>
  <div class="file_panel">
    <div class="flex">
      <button v-if="!processClicked" @click="readFile()">choose a file</button>
      <button v-if="currentlySelectedFile && isCSVFile()" @click="switchProcessClicked">
        Process
      </button>
    </div>

    <div v-if="!processClicked"> 
      <p>Original files:</p>
      <div
        v-if="props.originalFiles.length"
        v-for="file in props.originalFiles"
        :key="file.name"
      >
        <p
          :class="{ selected: currentlySelectedFile === file.name }"
          class="file"
          @click="readFile(file.path, file.name)"
        >
          |_ {{ file.name }}
        </p>
      </div>
      <p v-else>no files</p>

      <div v-if="props.processedFiles.length"> 
        <p>Processed files:</p>
        <div v-for="file in props.processedFiles" :key="file.name">
          <p
            :class="{ selected: currentlySelectedFile === file.name }"
            class="file"
            @click="readFile(file.path, file.name)"
          >
            |_ {{ file.name }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="processClicked">
      <ProcessSection
        :fileContent="fileContent"
        :showOnViewSection="showOnViewSection"
        :switchProcessClicked="switchProcessClicked"
        :processedFilename="processedFilename"
      />
    </div>
  </div>
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

.file_panel {
  min-width: 300px;
  height: 100vh;
  background: salmon;
}

.file_panel button {
  padding: 0.25em;
  margin: 0.25em;
}
</style>

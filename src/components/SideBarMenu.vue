<script setup>
import { onMounted, onUnmounted, defineProps, ref } from 'vue';
import { getFileName, readFileContents } from '../utils/file_scripts';
import ProcessSection from '../components/ProcessSection.vue';
import FileSelection from '../components/FileSelection.vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps(['originalFiles', 'processedFiles', 'showOnViewSection']);
const currentlySelectedFile = ref('');
const processClicked = ref(false);
const fileContent = ref('');
const processedFilename = ref('')

const readFile = async (path, filename) => {
  currentlySelectedFile.value = filename;
  let content = await readFileContents(path);
  
  if (!path) return

  if (!path.includes("processed_files")) {
    fileContent.value = content.split("\n");
  }else{
    fileContent.value = JSON.parse(content)
  }

  processedFilename.value = getFileName(path).split('.')[0]
  props.showOnViewSection(fileContent.value);
};

const onClickOutside = e => {
  if (e.target.tagName == "BUTTON") return

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
      <button v-if="!processClicked" @click="readFile()">+ FILE</button>
      <button v-if="currentlySelectedFile && isCSVFile()" @click="switchProcessClicked">
        Process
      </button>
      <button v-if="!processClicked" @click="store.dispatch('setCurrentView', 'options')">~ Options</button>
    </div>

    <section v-if="!processClicked"> 
      <FileSelection :sectionName="`ORIGINAL`" :files="props.originalFiles" :readFile="readFile" :currentlySelectedFile="currentlySelectedFile"   />
      <FileSelection :sectionName="`PROCESSED`" :files="props.processedFiles" :readFile="readFile" :currentlySelectedFile="currentlySelectedFile"   />
    </section>

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
.file_panel {
  min-width: 300px;
  height: 100vh;
  background: rgba(57,66,60);
  color: white;
  padding: 1em;
}

.file_panel button {
  padding: 0.25em;
  margin: 0.25em;
}
</style>

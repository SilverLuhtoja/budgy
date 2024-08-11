<script setup>
import { onMounted, onUnmounted, defineProps, ref, computed} from 'vue';
import { getFileName, readFileContents, saveProcessFile } from '../utils/file_scripts';
import FileSelection from '../components/FileSelection.vue';
import { useStore } from 'vuex';
import { processStatment } from '../utils/file_process_script';
import { Views } from '../stores/store.js'
import Greet from '../TempComponents/Greet.vue';

const store = useStore();
const props = defineProps(['originalFiles', 'processedFiles', 'showOnViewSection']);
const currentlySelectedFile = ref('');
const fileContent = ref('');
const processedFilename = ref('')
const isDefaultView  = computed(() => store.getters.currentView ==  Views.DEFAULT)

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
  store.dispatch('setCurrentView', Views.DEFAULT)
};

const isCSVFile = () => {
  return currentlySelectedFile.value.split('.').pop() === "csv"
}

const processFile = async () => {
  let content = await processStatment(fileContent.value);
  props.showOnViewSection(content);
  saveProcessFile(processedFilename.value, content)
};

const onClickOutside = e => {
  if (e.target.tagName == "BUTTON") return

  const notProcessedFile = currentlySelectedFile.value.split('.').length != 1
  if (!e.target.classList.contains('file') && notProcessedFile) {
    currentlySelectedFile.value = '';
    // fileContent.value = ''
    props.showOnViewSection('');
  }
};

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
      <button v-if="isDefaultView" @click="readFile()">+ FILE</button>
      <button v-if="isDefaultView && currentlySelectedFile && isCSVFile()" @click="processFile"> Process </button>
      <button  @click="store.dispatch('setCurrentView', 'options')"> {{isDefaultView ? "~" : "X"}} Options</button>
    </div>

    <section > 
      <FileSelection :sectionName="`ORIGINAL`" :files="props.originalFiles" :readFile="readFile" :currentlySelectedFile="currentlySelectedFile"   />
      <FileSelection :sectionName="`PROCESSED`" :files="props.processedFiles" :readFile="readFile" :currentlySelectedFile="currentlySelectedFile"   />
    </section>

    <Greet />
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

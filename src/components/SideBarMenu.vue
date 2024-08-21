<script setup>
import { onMounted, onUnmounted, ref, computed} from 'vue';
import { getFileName, ORGINAL_FILE_PATH, PROCESSED_FILE_PATH, readDirPath, readFileContents, saveProcessFile } from '../utils/file_scripts';
import FileSelection from '../components/FileSelection.vue';
import { useStore } from 'vuex';
import { processStatment } from '../utils/file_process_script';
import { Views } from '../stores/store.js'

const store = useStore();
const originalFiles = ref([])
const processedFiles = ref([])
const currentlySelectedFile = ref('');
const fileContent = ref('');
const processedFilename = ref('')
const isDefaultView  = computed(() => store.getters.currentView ==  Views.DEFAULT)

const updateFiles = async () => {
  originalFiles.value  = await readDirPath(ORGINAL_FILE_PATH);
  processedFiles.value  = await readDirPath(PROCESSED_FILE_PATH);
}

const readFile = async (path, filename) => {
  currentlySelectedFile.value = filename;
  let content = await readFileContents(path);
  
  // adding new file to list
  if (!path) {
    await updateFiles()
    store.dispatch('setViewContent', content.split("\n"))
    return 
  }

  if (!path.includes("processed_files")) {
    fileContent.value = content.split("\n");
  }else{
    fileContent.value = JSON.parse(content)
  }

  processedFilename.value = getFileName(path).split('.')[0]
  store.dispatch('setViewContent', fileContent.value)
  store.dispatch('setCurrentView', Views.DEFAULT)
};

const isCSVFile = () => {
  return currentlySelectedFile.value.split('.').pop() === "csv"
}

const processFile = async () => {
  let content = await processStatment(fileContent.value);
  store.dispatch('setViewContent', content)
  saveProcessFile(processedFilename.value, content)
};

const onClickOutside = e => {
  if (e.target.tagName == "BUTTON" || currentlySelectedFile.value == undefined ) return

  const notProcessedFile = currentlySelectedFile.value.split('.').length != 1
  if (!e.target.classList.contains('file') && notProcessedFile) {
    currentlySelectedFile.value = '';
    store.dispatch('setViewContent', '')
  }
};

onMounted(async () => {
  await updateFiles()
  window.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', onClickOutside);
});
</script>

<template>
  <main class="side_panel">
    <div class="flex">
      <button v-if="isDefaultView" @click="readFile()">+ FILE</button>
      <button v-if="isDefaultView && currentlySelectedFile && isCSVFile()" @click="processFile"> Process </button>
      <button  @click="store.dispatch('setCurrentView', 'options')"> {{isDefaultView ? "~" : "X"}} Options</button>
    </div>

    <section > 
      <FileSelection :sectionName="`ORIGINAL`" :files="originalFiles" :readFile="readFile" :currentlySelectedFile="currentlySelectedFile"   />
      <FileSelection :sectionName="`PROCESSED`" :files="processedFiles" :readFile="readFile" :currentlySelectedFile="currentlySelectedFile"   />
    </section>
  </main>
</template>

<style scoped>
.side_panel {
  min-width: 10vw;
  height: 100%;
  background: rgba(57,66,60);
  color: white;
  padding: 0 1em;
  position: fixed;
}

.side_panel button {
  padding: 0.25em;
  margin: 1em 0.25em ;
}
</style>

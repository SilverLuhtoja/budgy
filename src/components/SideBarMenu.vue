<script setup>
import { onMounted, onUnmounted, ref, computed} from 'vue';
import { getFileName, ORGINAL_FILE_PATH, PROCESSED_FILE_PATH, readDirPath, readFileContents, saveProcessFile, sortFilesByMonthsAndYear } from '../utils/file_scripts';
import FileSelection from '../components/FileSelection.vue';
import { useStore } from 'vuex';
import { processStatment } from '../utils/file_process_script';
import { Views } from '../stores/store.js'
import { isEmptyValue, isError, isObjEmpty } from '../utils/helpers.js';

const store = useStore();
const originalFiles = ref([])
const processedFiles = ref([])
const fileContent = ref('');
const processedFilename = ref('')
const isDefaultView  = computed(() => store.getters.currentView ==  Views.DEFAULT)
const currentSelectedFile  = computed(() => store.getters.currentSelectedFile)

const updateFiles = async () => {
  originalFiles.value  = sortFilesByMonthsAndYear(await readDirPath(ORGINAL_FILE_PATH));
  processedFiles.value  = sortFilesByMonthsAndYear(await readDirPath(PROCESSED_FILE_PATH))
}

const readFile = async (path, filename) => {
  store.dispatch('setCurrentSelectedFile', filename)
  let content = await readFileContents(path);
  
  if (content == undefined ) return

  if (isError(content)) {
    return store.dispatch("setErrorMessage", content)
  }
  
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
  return currentSelectedFile.value.split('.').pop() === "csv"
}

const processFile = async () => {
    let content = await processStatment(fileContent.value);
    if (isObjEmpty(content)) {
       store.dispatch('setErrorMessage', "Error with processing")
       return
    }
    
    store.dispatch('setViewContent', content)
    saveProcessFile(processedFilename.value, content)
};

const onClickOutside = e => {
  if (e.target.tagName == "BUTTON" || isEmptyValue(currentSelectedFile.value)) return

  const notProcessedFile = currentSelectedFile.value.split('.').length != 1
  if (!e.target.classList.contains('file') && notProcessedFile) {
    store.dispatch('setCurrentSelectedFile', '')
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
      <button v-if="isDefaultView && currentSelectedFile && isCSVFile()" @click="processFile"> Process </button>
      <button  @click="store.dispatch('setCurrentView', 'options')"> {{isDefaultView ? "~" : "X"}} Options</button>
    </div>

    <section > 
      <FileSelection :sectionName="`ORIGINAL`" :files="originalFiles" :readFile="readFile" />
      <FileSelection :sectionName="`PROCESSED`" :files="processedFiles" :readFile="readFile" />
    </section>
  </main>
</template>

<style scoped>
.side_panel {
  width: 12vw;
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

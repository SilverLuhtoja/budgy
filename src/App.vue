<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { ORGINAL_FILE_PATH, PROCESSED_FILE_PATH, createDirPath, readDirPath } from './utils/file_scripts';
import SideBarMenu from "./components/SideBarMenu.vue";
import ViewSection from "./components/ViewSection.vue";
import { saveConfigurationFile, getConfigurations } from './utils/file_scripts';

const originalFiles = ref('');
const processedFiles = ref('');
const content = ref('');

const showOnViewSection = (someContent) => {
  content.value = someContent
}


onMounted(async () => {
  await createDirPath(ORGINAL_FILE_PATH);
  await createDirPath(PROCESSED_FILE_PATH);
  originalFiles.value = await readDirPath(ORGINAL_FILE_PATH);
  processedFiles.value = await readDirPath(PROCESSED_FILE_PATH);
  
  document.addEventListener('keypress', e => {
    if (e.key == 'Escape') {
      window.close();
    }
  });

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});


//  TODO: make this active only for when processed files are viewed
const pressedKeys = ref(new Set());
function handleKeyDown(event) {
  pressedKeys.value.add(event.key);
  console.log('Keys pressed:', [...pressedKeys.value]);

  // Check for specific combinations
  if (pressedKeys.value.has('Control') && pressedKeys.value.has('c')) {
    console.log('Ctrl+C combination detected');
    // Perform action for Ctrl+C
  }

  if (pressedKeys.value.has('Shift') && pressedKeys.value.has('A')) {
    console.log('Shift+A combination detected');
    quickSaveHighlightedText()
    // Perform action for Shift+A
  }
}

function handleKeyUp(event) {
  pressedKeys.value.delete(event.key);
  console.log('Keys released:', [...pressedKeys.value]);
}

const quickSaveHighlightedText = async () => {
    let configurations = JSON.parse(await getConfigurations())
    let values = configurations['saved-options']
    const saveable = window.getSelection().toString()
    if (!values.includes(saveable))values.push(saveable)
    configurations['saved-options'] = values
    saveConfigurationFile(configurations);
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});
</script>

<template>
  <div class="container">
    <div class="row">
      <SideBarMenu :originalFiles="originalFiles" 
      :processedFiles="processedFiles" 
      :showOnViewSection="showOnViewSection"/>
      <ViewSection :content="content"/>
    </div>
  </div>
</template>

<style>
*{
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
}
</style>

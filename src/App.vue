<script setup>
import { onMounted, ref } from 'vue';
import { ORGINAL_FILE_PATH, PROCESSED_FILE_PATH, createDirPath, readDirPath } from './utils/file_scripts';
import SideBarMenu from "./components/SideBarMenu.vue";
import ViewSection from "./components/ViewSection.vue";

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

<script setup>
import { onMounted, ref } from 'vue';
import { ORGINAL_FILE_BATH, PROCESSED_FILE_BATH, createDirPath, readDirPath } from './utils/file_scripts';
import FileSection from "./components/FileSection.vue";
import ViewSection from "./components/ViewSection.vue";

const originalFiles = ref('');
const processedFiles = ref('');
const content = ref('');

const showOnViewSection = (someContent) => {
  content.value = someContent
}

onMounted(async () => {
  await createDirPath(ORGINAL_FILE_BATH);
  await createDirPath(PROCESSED_FILE_BATH);
  originalFiles.value = await readDirPath(ORGINAL_FILE_BATH);
  processedFiles.value = await readDirPath(PROCESSED_FILE_BATH);

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
      <FileSection :originalFiles="originalFiles" 
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

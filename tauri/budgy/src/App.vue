<script setup>
import { onMounted, ref } from 'vue';
import { createOriginalDir, readOriginalDir } from './utils/file_scripts';
import FileSection from "./components/FileSection.vue";
import ViewSection from "./components/ViewSection.vue";

const originalFiles = ref('');
const content = ref('');

const showOnViewSection = (someContent) => {
  content.value = someContent
}

onMounted(async () => {
  await createOriginalDir();
  originalFiles.value = await readOriginalDir();

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
      <FileSection :originalFiles="originalFiles" :showOnViewSection="showOnViewSection"/>
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
  /* justify-content: center; */
}

</style>

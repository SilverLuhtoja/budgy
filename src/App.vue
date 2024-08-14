<script setup>
import { onMounted, ref } from 'vue';
import { ORGINAL_FILE_PATH, PROCESSED_FILE_PATH, CONFIG_FILE_PATH, CONFIGURATIONS_FILE_PATH, EXPENDITURE_SETTINGS_PATH, readDirPath } from './utils/file_scripts';
import SideBarMenu from "./components/SideBarMenu.vue";
import ViewSection from "./components/ViewSection.vue";
import { create_dir, create_empty_json_file } from './utils/rust_file_scripts';

const originalFiles = ref('');
const processedFiles = ref('');
const content = ref('');

const showOnViewSection = (someContent) => {
  content.value = someContent
}

const init_files = async () => {
    create_dir(ORGINAL_FILE_PATH)
    create_dir(PROCESSED_FILE_PATH)
    create_dir(CONFIG_FILE_PATH)
    create_empty_json_file(CONFIGURATIONS_FILE_PATH)
    create_empty_json_file(EXPENDITURE_SETTINGS_PATH)

} 

onMounted(async () => {
  await init_files()
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

<script setup>
import { onMounted } from 'vue';
import { ORGINAL_FILE_PATH, PROCESSED_FILE_PATH, CONFIG_FILE_PATH, CONFIGURATIONS_FILE_PATH, EXPENDITURE_SETTINGS_PATH } from './utils/file_scripts';
import SideBarMenu from "./components/SideBarMenu.vue";
import ViewSection from "./components/ViewSection.vue";
import { create_dir, create_empty_json_file } from './utils/rust_file_scripts';

const init_files = async () => {
    create_dir(ORGINAL_FILE_PATH)
    create_dir(PROCESSED_FILE_PATH)
    create_dir(CONFIG_FILE_PATH)
    create_empty_json_file(CONFIGURATIONS_FILE_PATH)
    create_empty_json_file(EXPENDITURE_SETTINGS_PATH)
} 

onMounted(async () => {
  await init_files()
  
  document.addEventListener('keypress', e => {
    if (e.key == 'Escape') {
      window.close();
    }
  });
});
</script>

<template>
  <main class="row">
      <SideBarMenu  />
      <ViewSection  />
  </main>
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

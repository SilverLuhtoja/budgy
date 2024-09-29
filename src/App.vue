<script setup>
import { onMounted, computed } from 'vue';
import { ORGINAL_FILE_PATH, PROCESSED_FILE_PATH, CONFIG_FILE_PATH, CONFIGURATIONS_FILE_PATH, EXPENDITURE_SETTINGS_PATH } from './utils/file_scripts';
import SideBarMenu from "./components/SideBarMenu.vue";
import ViewSection from "./components/ViewSection.vue";
import { create_dir, create_empty_json_file } from './utils/rust_file_scripts';
import { useStore } from 'vuex';

const store = useStore()
const errorMessage = computed(() => store.getters.errorMessage)

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
      <div v-if="errorMessage" class="flash_message">
        <p> {{ errorMessage }} </p>
      </div>
      <SideBarMenu  />
      <ViewSection  />
  </main>
</template>

<style>
:root{
  --view-section-bg: rgb(141, 173, 152);
  --sidebar-section-bg: rgba(57,66,60);
}

*{
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  background: var(--view-section-bg);
  min-height: 100vh;
}

.flash_message{
  position: absolute;
  top: 1em;
  right: 1em;
  min-width: 30em;
  height: 5em;
  background: rgba(255, 16, 16, 0.719);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

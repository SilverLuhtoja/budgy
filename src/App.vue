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
        <h3> {{ errorMessage }} </h3>
      </div>
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

.flash_message{
  position: absolute;
  top: 0;
  left: 25%;
  width: 60em;
  height: 10em;
  background: red;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

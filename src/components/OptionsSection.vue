<script setup>
import { onMounted,ref } from 'vue';
import { saveConfigurationFile, getConfigurations } from '../utils/file_scripts';

const configurations = ref(null)
const onSaveHandler = () => {
    saveConfigurationFile()
}

onMounted( async () => {
    configurations.value = await getConfigurations()
})
</script>

<template>
    <section>
        <h1> Filter Configuration Page </h1>

        <div>
            {{ configurations }}
        </div>

        <button @click="onSaveHandler" > SAVE </button>
    </section>
</template>

<style scoped>
</style>

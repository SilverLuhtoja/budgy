<script setup>
import { defineProps } from 'vue';

const props = defineProps(['content'])

</script>

<template>
    <div class="view_panel">
        <h1> View Window </h1> 
        <div v-if="props.content && props.content.length && Array.isArray(props.content)" v-for="line,idx in props.content" :key="idx">
            {{ line }}
        </div>
    </div>
</template>

<style scoped>
.view_panel{
    width: 100%;
    overflow-x: auto;
}
</style>
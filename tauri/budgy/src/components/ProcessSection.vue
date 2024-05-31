<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { processColumnSelection } from '../utils/file_process_script';

const props = defineProps(['fileContent', 'showOnViewSection', 'switchProcessClicked']);
const columnOptions = ref('')

const getColumnOptions = () => {
    const firstLine = props.fileContent[0]
    columnOptions.value = firstLine.split(',')
}

const filterSelectedColumns = () => { 
  let options = document.getElementsByName('column_selection');

  let selectedColumns = []
  options.forEach(item => {
    if (item.checked) selectedColumns.push(item.id)
  })
  return selectedColumns
}

const processFile = () => {
  const columnOptions =  filterSelectedColumns()
  let content = processColumnSelection(props.fileContent, columnOptions)
  props.showOnViewSection(content);
}

onMounted(()=>{
    getColumnOptions()
})
</script>

<template>
    <div>
        <button @click="props.switchProcessClicked">Cancel</button>
        <p>Process Options:</p>
        <!-- <div>
            <p>Defaults:</p>
                <p v-for="i in [1,2,3]" :key="i">
                    <input type="radio" id="i" name="default" :value="i">
                    <label :for="i">{{i}}</label><br>
                </p>
        </div> -->

        <div>
            Select columns to be included in selection (no default should be selected):
             <p v-for="option in columnOptions" :key="option">
                <input type="checkbox" :id="option" name="column_selection" :value="option">
                <label :for="option">{{option}}</label>
            </p>
        </div>
        <button >save as default (pop up for name)</button>
        <button @click="processFile">apply</button>
    </div>
</template>
<style scoped>
</style>
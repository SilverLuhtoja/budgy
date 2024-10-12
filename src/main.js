import { createApp } from "vue";
import App from "./App.vue";
import store from './stores/store';
import VueApexCharts from 'vue3-apexcharts';

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { BiFolderPlus , IoOptionsOutline, MdRemoveredeyeOutlined, IoCloseSharp, GiProcessor, BiQuestionSquare} from "oh-vue-icons/icons";

addIcons(BiFolderPlus , IoOptionsOutline, MdRemoveredeyeOutlined, IoCloseSharp, GiProcessor, BiQuestionSquare);

const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.use(store);
app.use(VueApexCharts);
app.mount('#app');

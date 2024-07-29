import { createApp } from "vue";
import App from "./App.vue";
import store from './stores/store';
import VueApexCharts from 'vue3-apexcharts';

const app = createApp(App);
app.use(store);
app.use(VueApexCharts);
app.mount('#app');

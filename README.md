# Tauri + Vue 3

This template should help get you started developing with Tauri + Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

To run application on dev mode: npm run tauri dev


For Graphs using currently (deside on one):
1. npm install vue3-charts
2. or npm install apexcharts and npm install vue-apexcharts and nom install vue3-apexcharts (https://apexcharts.com/vue-chart-demos/)


TODO: 

This is MVP roadmap:

GRAPHS:
1. ~~Pie-chart calculation, every category is calculated and showed from expected maximum expenditure and show on pie chart how much was actually used.
Example: Expected spending is 20% from all income, in a month actually 16% was used. This should return 80% on pie-chart.~~

2. ~~Line-Chart, same as pie-chart, but it will show expected expenditure in lines and total values, second line shows how much was actually spent.~~

3. Bar-chart showing difference of last and this month.
4. Quarter, half and year charts with average spending data accordingly.

FUNCTIONALITY:
1. add expected values and percents for categories ( Example: transport : 20% - 200eur)
2. Think how to make it more intuitive to use
3. Try to cooperate more Rust into project

VISUALS:
Update all view for make it more modern and professional
1. options view 
2. processed file view
3. regular view
4. possibility to hide sidepanel

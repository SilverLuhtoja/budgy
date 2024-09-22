# Tauri + Vue 3

This template should help get you started developing with Tauri + Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

To run application on dev mode: 
* npm run tauri dev


For Graphs using currently (deside on one):
1. npm install vue3-charts
2. or npm install apexcharts and npm install vue-apexcharts and nom install vue3-apexcharts (https://apexcharts.com/vue-chart-demos/)


This is MVP roadmap:

GRAPHS:
1. ~~Pie-chart calculation, every category is calculated and showed from expected maximum expenditure and show on pie chart how much was actually used.
Example: Expected spending is 20% from all income, in a month actually 16% was used. This should return 80% on pie-chart.~~

2. ~~Line-Chart, same as pie-chart, but it will show expected expenditure in lines and total values, second line shows how much was actually spent.~~

3. ~~Bar-chart showing difference of last and this month.~~

    TODO: 
    1. ~~Save selected file value to store, it needs to be available in proccessed view~~
    2. ~~Make algorythm to cycle months, they also should be in order (possibly put requirement to have year in csv file name)~~ 
    3. ~~Get both selected file (month) and last month spendings ( if jaanuar then there needs to be detsember)~~ 
    4. ~~In graph show current month and last month name~~ 

4. Quarter, half and year charts with average spending data accordingly.
    1. ~~make button - for year overview button~~
    2. make page -
        1. ~~by default shows ongoing current year~~
        2. ???? >  this should include buttons - quarter, half and full year
        3. ???? > quarted button - I , II , III , IV , shows also last quarter (according months)
        4. ???? >  half - I , II , shows also current half year
        5. ~~year - what year~~
    3. ~~Maybe make is possible to select example this januar and last januar or what ever other month/months (like multiple for compare)~~
        1. ~~when selecting month in one it should not include in other selection~~

FUNCTIONALITY:
1. ~~ add expected values and percents for categories ( Example: transport : 20% - 200eur) ~~
2. Think how to make it more intuitive to use
3. ~~ Try to cooperate more Rust into project ~~ 
4. ~~make an error flash messaging~~
5. Maybe make it possible to manipulate saved files: edit, delete 
6. ~~when processing file and something is not put in category (something is still unfiltered), then make it stand out in file view, example put (!) next to filename~~
    1. ~~it needs to remove (!) once there is no more unfiltered items.~~
7. ~~When saving proccess file, it should update the processed file list~~
8. Make a Quick Tutorial/Guide, how systems work.

VISUALS:
Update all view for make it more modern and professional
1. Update Sidebar buttons with icons and make it more user friendly (maybe possible to add popUp, do tell what some button does)
2. OverView a bit better
3. Make processed view better
4. Change colorScheme

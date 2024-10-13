<script setup>
import { useStore } from 'vuex';

const store = useStore();
</script>

<template>
    <main class="flex">
        <section class="legend">
            <div>
                <img src="../assets/tutorial/buttons_legend.png" alt="processing files">
                <h1> LEGEND </h1>
                <div class="flex">
                    <v-icon  class="icon" name="bi-folder-plus"  scale="2"  />
                    <div>
                        <h3> Lets you to import bank statements into program </h3>
                        <h4>Notes:</h4>
                        <ol>
                            <li>Each statement must be separated by month</li>
                            <li>Each statement must be named as estonian month_year <i>(EXAMPLE : jaanuar_2024)</i></li>
                            <li>Statement will be present under <i>ORIGINAL FILES</i> menu</li>
                        </ol>
                    </div>
                </div>
                <div class="flex">
                    <v-icon class="icon" name="gi-processor" scale="2"  />
                    <div>
                        <h3> Button to process imported statements based on provided configurations </h3>
                        <h4>Notes:</h4>
                        <ol>
                            <li> Fields that are not processed, will be under <i>not_filtered</i> category </li>
                            <li> Statements must be processed again once configurations have changed </li>
                            <li> Processed files will be present under <i>PROCESSED FILES</i> menu  </li>
                            <li> <i>(!)</i> will appear next to file if there are uncategorized fields </li>
                        </ol>
                    </div>
                </div>
                <div class="flex">
                    <v-icon class="icon"  name="io-options-outline" scale="2"  />
                    <div>
                        <h3> Configuration page </h3>
                        <h4>Notes:</h4>
                        <ol>
                            <li> Place to categories your spendings </li>
                            <li> Place to split categories by percentages </li>
                            <li> Graphs need <i>INCOME</i> data to show </li>
                        </ol>
                    </div>
                </div>
                <div class="flex">
                    <v-icon class="icon"  name="md-removeredeye-outlined" scale="2"  />
                    <div>
                        <h3> Overview page</h3>
                        <h4>Notes:</h4>
                        <ol>
                            <li> All year month spendings based on processed files</li>
                            <li> month to month comparison </li>
                        </ol>
                    </div>
                </div>
            
                <div class="flex">
                    <v-icon class="icon"   name="bi-question-square" scale="2"  />
                    <div>
                        <h3> Tutorial page </h3>
                    </div>
                </div>
               
            </div>
            
            <div class="tips"> 
                <h1>TIPS:</h1>
                
                <ul>
                    <li> 
                        In processed file view, its possible to quickly save highlighted text to <i>saved_options</i> category in configuration <br> by using <i>SHIFT + A </i> combination.<br>
                        With this there is no need to memorize items and it will speed up process to adding the matcher items.
                    </li>
                    <li> 
                        When errors occur, there will be red colored box on top-right corner, with error message and suggested changes.
                    </li>
                    <li> 
                        All app files/data will be saved to <i>C:\Users\(computer user name)\AppData\Local\Budgy\resources</i> directory.<br>
                        Its possible to manipulate files directly from there.
                    </li>
                </ul>
            </div>
        </section>


        <section >
            <h1> QUICK GUIDE</h1>
            <div>
                <div class="step">
                    <h2>Step 1:</h2>
                    <ul>
                        <li>
                            <v-icon name="bi-folder-plus"  scale="2"  /> 
                            Click the <b> add folder button </b>
                        </li>
                        <li>
                            Import csv file <i>(naming should be month_year.csv)</i>
                        </li>
                    </ul>
                </div>

                <div class="step ">
                    <h2>Step 2:</h2>
                    <img src="../assets/tutorial/how_to_process_files.png" alt="processing files">
                    <ul>
                        <li>
                            Click on the imported csv file
                        </li>
                        <li>
                            Then click on process button (marked in yellow)
                        </li>
                        <li>
                            Processed view will open and the file will be under <i>PROCCESED FILES</i> menu.
                        </li>
                        <li>
                            <b>Note: </b> File will be marked with (!), when there items that are not categorized.
                            Not categorized items will be under not_filtered section.
                        </li>
                    </ul>
                </div>

                <div class="step ">
                    <h2>Step 3:</h2>
                    <h3>Adding categories and matchers:</h3>
                    <div>
                        <img src="../assets/tutorial/configurations_button.png" alt="configurations_button">
                        <ul>
                            <li>
                                Click on the configuration button (marked in yellow)
                            </li>
                            <li>
                                Configuration will be filtered and matched by records <b>receiver/sender</b> or by <b>description</b>
                            </li>
                            <li>
                                Add your <b>INCOME</b> records.<br><br> 
                                Example:<br> 
                                in csv file, there is payslip from: COMPANY-A with description: November 2023 salary. <br> 
                                In text-area you would write COMPANY-A or just salary.<br><br>
                            </li>
                            <li>
                                Add categories and matcher names based on csv file you would like to keep track of.<br><br> 
                                Example:<br>  
                                transport - train, bolt;  food - pizza, sushi;  investments etc..<br><br>
                            </li>
                            <li>
                                <b>Save work</b>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3>Planning spending by percentage:</h3>
                        <img src="../assets/tutorial/configurations_expenditure.png" alt="configurations_expenditure">
                        <ul>
                            <li>
                               After saving categories, there will appear some extra configurations.<br>
                               This will let you plan your spendings by month and can give quick overview about budget situation. <br><br>
                               Example: <br> 
                               We have salary 1000$. One of categories is loans, which planned spending has set to 50%.<br>
                               This month spent on loans is 550$.<br>
                               In graphs and overview panel, it will quickly show that selected months spending for loans is over budget.<br><br>
                            </li>
                            <li>Set your percentages</li>
                            <li>
                                <b>Save work</b>
                            </li>
                            <li>
                            <b>Note: </b> Graphs will not work if those configurations are not set.
                        </li>
                        </ul>
                    </div>
                </div>

                <div class="step ">
                    <h2>Step 4:</h2>
                    <ul>
                        <li>
                            After configurations are set, then original csv file should be processed again.<br>
                            This should now correctly match configuration and make spearated categorized section with graphs data.
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>

main{
    background-color: rgba(255, 252, 223, 0.35);
    padding: 2em;
}

section div{
    margin:1em;
}

.tips {
    margin-top:4em !important;
}

img{
    background: white;
    padding: 1em;
    margin-right: 2em;
    max-width:  50em;
}

h1{
    font-size: 1.75em;
    text-decoration: underline;
}

.legend div {
    margin:0.3em 0;
}

.icon {
    margin-right: 0.7em;
}
.flex{
    display: flex;
}

.step{
    margin-bottom: 2em;
}
.step h2{
    margin-bottom:0.3em;
}

li{
    margin-top: 0.3em;
    font-size: 1.1em;
}
</style>
<template>
    <div>
        <h1 style="text-align: left; margin-left: 30px; margin-top: 30px; color: rgba(0,0,0,0.5);">
            Dashboard
        </h1>
        
    </div>

    <div style="margin-top: 3vw;">
            <div class="row">
                <div class="col-sm">
                    <div class="card-small">
                        <div class="card-content">  
                            <p style="color: #da7171; font-size: 2.2vw;">$ {{ pie_data.expense_amount }}</p>
                            <p style="font-size: 1vw; margin-top: -0.5vw;">
                                Expenses
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-sm">
                    <div class="card-small">
                        <div class="card-content">
                            <p style="color: #5864d3; font-size: 2.2vw;">
                                $ {{ pie_data.income_amount }}
                            </p>
                            <p style="font-size: 1vw; margin-top: -0.5vw;">
                                Incomes
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div class="card-big" style="margin-top: 3vh;">
                    <div class="card-content">  
                        <div class="display-type-buttons">
                            <div class="display-type-buttons-container">
                                <button type="button" :class="[isIncomePage ? 'btn-display-type' : 'btn-display-type-selected']" @click="changeDashboardPage(false)" >Expenses</button>
                                <button type="button" :class="[!isIncomePage ? 'btn-display-type' : 'btn-display-type-selected']" @click="changeDashboardPage(true)" >Incomes</button>

                            </div>
                        </div>

                        <div class="card-big-data">
                            <div v-if="pie_data" class="row">

                                <div class="col-6">
                                    <div style="height: 26vw;">
                                        <Doughnut :data="pie_data" :options="pie_options"/>
    
                                    </div>
                                </div>
    
                                <div class="col-6">
                                    <div class="col">
                                        <table style="margin-top: 3vw;">
                                            <tr class="char-data-elem" v-for="(color, index) in pie_data.datasets[0].backgroundColor" :key="index">
                                                <td>
                                                    <div :style="getColorStyle(color)" class="color-circle"></div>
                                                </td>

                                                
                                                <td>
                                                    <span class="material-symbols-outlined" style="font-size: 2vw; margin-left: 1vw;">
                                                        {{pie_data.categoryIcons[index]}}
                                                    </span>
                                                </td>
                                                <td>
                                                    <p class="char-data-element-label">{{pie_data.labels[index]}}</p>
                                                </td>


                                                <td>
                                                    <p class="char-data-element-data">{{pie_data.datasets[0].data[index]}} $</p>

                                                </td>

                                                <td>
                                                    <p class="char-data-element-data">{{Number(((pie_data.datasets[0].data[index] / (isIncomePage ? pie_data.income_amount : pie_data.expense_amount))*100).toFixed(1))}} %</p>

                                                </td>
    
                                            </tr>

                                        </table>

                                    </div>
                                </div>
                            </div>
                            

                        </div>
                    </div>
                </div>
            </div>
        </div>

    
   
</template>
<script setup>
import axios from 'axios';

import { ref, computed } from 'vue';


import { Doughnut } from 'vue-chartjs'

import { onMounted } from 'vue';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend)
const sort = ref('');
const transaction_category_id = ref(0);
const transaction_description = ref('');
const transaction_date = ref(new Date().toISOString().slice(0,10));
const transaction_amount = ref('');
const transactions = ref([]);
const categories = ref([]);
const show_add_transaction_modal = ref(false);

const isIncomePage = ref(false);

const pie_data = ref({
  "labels": [],
  "datasets": [
    {
      "backgroundColor": [],
      "data": []
    }
  ]
});

const pie_options = ref({
    responsive: true,
    maintainAspectRatio: false,
    
});


onMounted(() => {
  get_categories_data();
  get_transactions_data();
  get_transactions_piechar_data(isIncomePage.value);

});

function getColorStyle(color) {
  return {
    backgroundColor: color,
  };
}

function changeDashboardPage(new_value) {
    isIncomePage.value = new_value;
    get_transactions_piechar_data(isIncomePage.value);

}

function add_transaction() {
    show_add_transaction_modal.value = !show_add_transaction_modal.value;
    save_transaction_to_db();
}

function save_transaction_to_db() {
    axios.post('http://localhost:3000/add_transaction', null, {params  : { 
        category_id: transaction_category_id.value,
        description: transaction_description.value, 
        date: transaction_date.value,
        amount: transaction_amount.value
    }})
    .then(response => {
        get_transactions_data();
        get_transactions_piechar_data(isIncomePage.value);
    });
}

function get_transactions_data() {
    
    axios.get('http://localhost:3000/get_transactions')
        .then(response => {
            console.log(response)
            transactions.value = response.data
        });
}

function get_categories_data() {
    axios.get('http://localhost:3000/get_categories')
    .then(response => {
        console.log(response)
        categories.value = response.data
    });
}   


function get_transactions_piechar_data(isIncome) {
    axios.get('http://localhost:3000/get_transactions_piechart_data', {params: {is_income: isIncome}}).then(response => {
        console.log(response.data)
        pie_data.value = response.data;
    });
}


function filterTransactionsByWeek(transactions) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= oneWeekAgo && transactionDate <= now;
  });
}

function filterTransactionsByMonth(transactions) {
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= oneMonthAgo && transactionDate <= now;
  });
}

function filterTransactionsByYear(transactions) {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= oneYearAgo && transactionDate <= now;
  });
}




</script>
<style>
.btnsort{
    color: #00658D  ;
    border-style: solid;
    background-color: transparent;
    background-image: none;
    border-color: #71787E;
    border-radius: 30px;
    margin-left: 15px;
    margin-right: 15px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 0px;
    font-size: 0.7vw;
    font-weight: bold;
}

.pagination {
    display: flex;
    float: right;
    justify-content: center;
    margin-bottom: 1vw;
    margin-right: 3vw;
}

.pagination_text {
    margin-right: 10px;
    margin-top: 15px;
    font-size: 16px;
    color: rgba(0,0,0,0.5);
}

.custom-modal {
    border-radius: 50%;
}

.card-small{
    background: #E7E8EB;
    border-radius: 2vw;
    height: 12vh;
    margin-left: 3vw;
    margin-right: 3vw;
    text-align: left;
    box-shadow: 0px 5px 10px lightgrey;
}

.card-big{
    background: #E7E8EB;
    border-radius: 2vw;
    height: 70vh;
    margin-left: 3vw;
    margin-right: 3vw;
    text-align: left;
}
.card-content{
    margin-left: 2vw;
    padding-top: 0.5vw ;
    padding-bottom: 0.5vw ;
    
}

.display-type-buttons{
    display: flex;
    justify-content: center;
}

.btn-display-type{
    background-color: #edeef2;
    margin-left: 0.1vw;
    border: none;
    width: 14vw;
    padding: 0.5vw;
    border-radius: 3vw;
    height: 2.5vw;

    font-weight: bold;
    font-size: 0.8vw;
    transition: background-color 0.5s ease;
    
}

.btn-display-type:hover{
    background-color: #e0e1e6;

    
}

.btn-display-type-selected{
    background-color: #C6E7FF;
    margin-left: 0.1vw;
    border: none;
    width: 14vw;
    padding: 0.5vw;
    border-radius: 3vw;
    height: 2.5vw;

    font-weight: bold;
    font-size: 0.8vw;
    
}


.display-type-buttons-container{
    background-color: #edeef2;
    padding: 0.2vw;
    border-radius: 3vw;
    box-shadow: 0px 5px 10px lightgrey;

}

.card-big-data{
    margin-top: 3vw;
}

.color-circle {
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

.char-data-elem{
    height: 4vw;
    font-size: 1vw;
    
}
.char-data-element-label{
    font-weight: 500;  
    margin-left: 0.25vw; 
    margin-top: 0.35vw;
}

.char-data-element-data{
    font-weight: 500;  
    padding-left: 2vw;
    margin-left: 0.5vw; 
    margin-top: 0.35vw;
}

</style>
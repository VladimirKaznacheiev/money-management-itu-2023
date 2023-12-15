<template>
    <div>
            <h1 style="text-align: left; color: rgba(0,0,0,0.5);">
                Transactions
            </h1>
            
    </div>
    <div style="display: flex; align-items: left; margin-top: 10px;">
        <p style="text-align: left; color: rgba(0,0,0,0.5); padding: 10px; margin: 0;">
                Sort By:
        </p>
        <button type="button" class="btnsort" @click="setSort('Week')">Week</button>
        <button type="button" class="btnsort" @click="setSort('Month')">Month</button>
        <button type="button" class="btnsort" @click="setSort('Year')">Year</button>
        <button class="btn btn-primary" type="submit" style="display: flex; align-items: center; margin-left: auto;" @click="show_add_transaction_modal = !show_add_transaction_modal">
            <span class="material-symbols-outlined">add</span>
            Add
        </button>
        <Modal name="m1" v-model:visible="show_add_transaction_modal" :title="'Add Transaction'" :maskClosable="false" :closable="false" :cancelButton="{text: 'cancel', onclick: () => {show_add_transaction_modal = !show_add_transaction_modal}, loading: false}" :okButton="{text: 'Add transaction +', onclick: () => {add_transaction();}, loading: false}">
            <div>
                <div class="form-group">
                    <div class="input-group my-3">
                        <input type="text" class="form-control" v-model="transaction_category" placeholder="Input category" />
                    </div>
                    <div class="input-group my-3">
                        <input type="text" class="form-control" v-model="transaction_description" placeholder="Input description" />
                    </div>
                    <div class="input-group my-3">
                        <input type="date" class="form-control" v-model="transaction_date" placeholder="Transaction date" />
                    </div>
                    <div class="input-group my-3">
                        <input type="number" class="form-control" v-model="transaction_amount" placeholder="Input amount $" />
                    </div>
                </div>
            </div>
        </Modal>
    </div>
    <div class="container">
            <div class="row">
                <div class="col">
                    <table class="table" style="border: 1px;">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Category</th>
                                <th scope="col">Description</th>
                                <th scope="col">Date</th>
                                <th scope="col">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
                                <td>{{ transaction.id }}</td>
                                <td>{{ transaction.category }}</td>
                                <td>{{ transaction.description }}</td>
                                <td>{{ transaction.date }}</td>
                                <td>{{ transaction.amount }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    
   
</template>
<style>
.btnsort{
    color: #007bff;
    background-color: transparent;
    background-image: none;
    border-color: #007bff;
    border-radius: 15%;
    margin-left: 10px;
}
</style>
<script setup>
import axios from 'axios';

import { ref, computed } from 'vue';

import { Modal } from 'usemodal-vue3';

import { Pie } from 'vue-chartjs'


import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const sort = ref('');
const transaction_category = ref('');
const transaction_description = ref('');
const transaction_date = ref(new Date().toISOString().slice(0,10));
const transaction_amount = ref('');
const transactions = ref([]);
const show_add_transaction_modal = ref(false);
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
});



function add_transaction() {
    show_add_transaction_modal.value = !show_add_transaction_modal.value;
    save_transaction_to_db();
}

function save_transaction_to_db() {
    axios.post('http://localhost:3000/add_transaction', null, {params  : { 
        category: transaction_category.value,
        description: transaction_description.value, 
        date: transaction_date.value,
        amount: transaction_amount.value
    }})
    .then(response => {
        get_transactions_data();
        get_transactions_piechar_data();
    });
}

function get_transactions_data() {
    
    axios.get('http://localhost:3000/get_transactions')
        .then(response => {
            console.log(response)
            transactions.value = response.data
        });
}
function get_transactions_piechar_data() {
    axios.get('http://localhost:3000/get_transactions_piechart_data').then(response => {
        console.log(response.data)
        pie_data.value = response.data;
    });
}
function setSort(value) {
  sort.value = value;
}

const filteredTransactions = computed(() => {
  switch (sort.value) {
    case 'Week':
      return filterTransactionsByWeek(transactions.value);
    case 'Month':
      return filterTransactionsByMonth(transactions.value);
    case 'Year':
      return filterTransactionsByYear(transactions.value);
    default:
      return transactions.value;
  }
});

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




get_transactions_data();
get_transactions_piechar_data();

</script>


get_transactions_data();
get_transactions_piechar_data();

</script>

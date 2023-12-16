<template>
    <div>
        <h1 style="text-align: left; margin-left: 30px; margin-top: 30px; color: rgba(0,0,0,0.5);">
            Transactions
        </h1>
        
    </div>
    <div style="display: flex; align-items: left; margin-top: 1.5vw;">
        <button class="btn btn-primary" type="submit" style="display: flex; align-items: center; margin-left: auto;margin-right: 40px; font-size: 16px;" @click="show_add_transaction_modal = !show_add_transaction_modal">
            <span class="material-symbols-outlined">add</span>
            Add new transaction
        </button>
        <Modal name="m1" v-model:visible="show_add_transaction_modal" :modalClass="'custom-modal'" :title="'Add Transaction'" :maskClosable="false" :closable="false" :cancelButton="{text: 'cancel', onclick: () => {show_add_transaction_modal = !show_add_transaction_modal}, loading: false}" :okButton="{text: 'Add transaction +', onclick: () => {add_transaction();}, loading: false}">
            <div>
                <div class="form-group">
                    <div class="display-type-buttons-transaction">
                        <div class="display-type-buttons-container-transaction">
                            <button type="button" :class="[!transaction_is_income ? 'btn-display-type-selected-transaction' : 'btn-display-type-transaction']" @click="transaction_is_income = false">Expense</button>
                            <button type="button" :class="[transaction_is_income ? 'btn-display-type-selected-transaction' : 'btn-display-type-transaction']" @click="transaction_is_income = true">Income</button>
                        </div>
                    </div>
                    <br/>
                    <select class="form-select" aria-label="Select transaction example" v-model="transaction_category_id">
                        <option :value="0" selected>Select transaction category</option>
                        <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
                    </select>
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
    <div style="margin-left: 30px; margin-top: 20px; ">
            <div class="row">
                <div class="col">
                    <table class="table">
                        <thead>
                            <tr class="table-secondary">
                                <th scope="col">Category</th>
                                <th scope="col">Description</th>
                                <th scope="col">Date</th>
                                <th scope="col">Amount</th>
                                <th scope="col"></th> 
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
                                <td>{{ get_category_name_by_id(transaction.categoryId) }}</td>
                                <td>{{ transaction.description }}</td>
                                <td>{{ formatISODateToDateTime(transaction.date) }}</td>
                                <td>{{ transaction.amount }} $</td>
                                <td>
                                    <button style="background: none; border: none;">
                                        <span class="material-symbols-outlined" style="font-size: 18px; color: #71787E;">delete</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="pagination">

            <p class="pagination_text">Page {{currentPage}} / {{totalPages}}</p>

            <button @click="prevPage" :disabled="currentPage === 1" style="background: none; border: none; margin-right: 10px; font-size: 24px;">&lt;</button>
            <button @click="nextPage" :disabled="currentPage === totalPages" style="background: none; border: none; font-size: 24px;">&gt;</button>
        </div>
    
   
</template>
<script setup>
import axios from 'axios';

import { ref, computed } from 'vue';

import { Modal } from 'usemodal-vue3';

import { format } from 'date-fns';

import { onMounted } from 'vue';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend)
const sort = ref('');
const transaction_category_id = ref(0);
const transaction_description = ref('');
const transaction_date = ref(new Date().toISOString().slice(0,10));
const transaction_amount = ref();
const transaction_is_income = ref(false);
const transactions = ref([]);
const categories = ref([]);
const show_add_transaction_modal = ref(false);


onMounted(() => {
  get_categories_data();
  get_transactions_data();

});



function add_transaction() {
    show_add_transaction_modal.value = !show_add_transaction_modal.value;
    save_transaction_to_db();
}

function save_transaction_to_db() {
    axios.post('http://localhost:3000/add_transaction', null, {params  : { 
        category_id: transaction_category_id.value,
        description: transaction_description.value, 
        date: transaction_date.value,
        amount: transaction_amount.value,
        is_income: transaction_is_income.value
    }})
    .then(response => {
        get_transactions_data();
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


function get_category_name_by_id(id) {
    console.log(id);
    let elem = categories.value.find(category => category.id == id);
    if (elem != null) {
        return elem.name;
    }
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

function formatISODateToDateTime(isoDateString) {
    const dateTime = new Date(isoDateString);
    return format(dateTime, 'dd-MM-yyyy HH:mm');
}
const itemsPerPage = ref(20);
const currentPage = ref(1);

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value -= 1;
    }
};

const totalPages = computed(() => {
    return Math.ceil(filteredTransactions.value.length / itemsPerPage.value);
});

const paginatedTransactions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredTransactions.value.slice(start, end);
});


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
    font-size: 16px;
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

.display-type-buttons-transaction{
    display: flex;
    justify-content: center;
}

.display-type-buttons-container-transaction{
    background-color: #edeef2;
    
    border-radius: 20px;

}

.btn-display-type-transaction{
    /* background: #00658D; */
    background-color: #edeef2;
    border: none;
    width: 200px;
    padding: 10px;
    border-radius: 20px;
    height: 40px;

    font-weight: normal;
    font-size: 15px;
    transition: background-color 0.5s ease;
    
}

.btn-display-type-transaction:hover{
    /* background: #00658D; */
    background-color: #e0e1e6;

    
}

.btn-display-type-selected-transaction{
    /* background: #00658D; */
    background-color: #C6E7FF;
    border: none;
    width: 200px;
    padding: 10px;
    border-radius: 20px;
    height: 40px;

    font-weight: normal;
    font-size: 15px;
    
}

.custom-modal {
    border-radius: 50%;
}

</style>
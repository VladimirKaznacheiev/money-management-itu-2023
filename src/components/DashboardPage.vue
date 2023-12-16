<template>
    <div class="container">
        <div>
            <h1>Dashboard</h1>
        </div>

        <button type="button" class="btn btn-primary" @click="show_add_transaction_modal = !show_add_transaction_modal" >Add transaction +</button>

        <Modal name="m1" v-model:visible="show_add_transaction_modal" :maskClosable="false" :closable="false" :cancelButton="{text: 'cancel', onclick: () => {show_add_transaction_modal = !show_add_transaction_modal}, loading: false}" :okButton="{text: 'Add transaction +', onclick: () => {add_transaction();}, loading: false}">
            <div>
                 <div class="form-group">
                    
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
                            <tr v-for="transaction in transactions" :key="transaction.id">
                                <td>{{ transaction.id }}</td>
                                <td>{{ get_category_name_by_id(transaction.categoryId) }}</td>
                                <td>{{ transaction.description }}</td>
                                <td>{{ transaction.date }}</td>
                                <td>{{ transaction.amount }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col">
                    <Pie :data="pie_data" :options="pie_options"/>

                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import axios from 'axios';

import { ref } from 'vue'

import { Modal } from 'usemodal-vue3';

import { Pie } from 'vue-chartjs'

import { onMounted } from 'vue';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const transaction_category_id = ref(0);
const transaction_description = ref('');
const transaction_date = ref(new Date().toISOString().slice(0,10));
const transaction_amount = ref('');
const transactions = ref([]);
const categories = ref([]);
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
        category_id: transaction_category_id.value,
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

function get_categories_data() {

    axios.get('http://localhost:3000/get_categories')
    .then(response => {
        console.log(response)
        categories.value = response.data
    });

}

function get_transactions_piechar_data() {
    axios.get('http://localhost:3000/get_transactions_piechart_data').then(response => {
        console.log(response.data)
        pie_data.value = response.data;
    });
}


function get_category_name_by_id(id) {
    console.log(id);
    let elem = categories.value.find(category => category.id == id);
    if (elem != null) {
        return elem.name;
    }
}


onMounted(() => {
  get_categories_data();
  get_transactions_data();
  get_transactions_piechar_data();

});


</script>

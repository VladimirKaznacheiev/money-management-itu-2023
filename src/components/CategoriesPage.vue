<template>
    <div class="container">
        <div>
            <h1>Categories</h1>
        </div>

    </div>
</template>

<script setup>
import axios from 'axios';

import { ref } from 'vue'


import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

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




get_transactions_data();
get_transactions_piechar_data();

</script>

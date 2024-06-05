<!--
    Name: components/DashboardPage.vue
    Authors: Volodymyr Burylov
             Volodymyr Kaznacheiev
             Maksim Kalutski
    Date: 05/12/2023
-->

<template>
  <div>
    <h1 class="dashboard-title">
      Dashboard
    </h1>
  </div>

  <div class="dashboard-content">
    <div class="row">
      <div class="col-sm">
        <div class="card-small">
          <div class="card-content">
            <p class="expense-amount">$ {{ pie_data.expense_amount }}</p>
            <p class="expense-label">
              Expenses
            </p>
          </div>
        </div>
      </div>
      <div class="col-sm">
        <div class="card-small">
          <div class="card-content">
            <p class="income-amount">
              $ {{ pie_data.income_amount }}
            </p>
            <p class="income-label">
              Incomes
            </p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="card-big">
        <div class="card-content">
          <div class="display-type-buttons">
            <div class="display-type-buttons-container">
              <button type="button" :class="[isIncomePage ? 'btn-display-type' : 'btn-display-type-selected']"
                      @click="changeDashboardPage(false)">Expenses
              </button>
              <button type="button" :class="[!isIncomePage ? 'btn-display-type' : 'btn-display-type-selected']"
                      @click="changeDashboardPage(true)">Incomes
              </button>
            </div>
          </div>

          <div class="card-big-data">
            <div v-if="pie_data" class="row">
              <div class="col-6">
                <div class="chart-container">
                  <Doughnut :data="pie_data" :options="pie_options"/>
                </div>
              </div>

              <div class="col-6">
                <div class="col">
                  <table class="data-table">
                    <tr class="char-data-elem" v-for="(color, index) in pie_data.datasets[0].backgroundColor"
                        :key="index">
                      <td>
                        <div :style="getColorStyle(color)" class="color-circle"></div>
                      </td>
                      <td>
                        <span class="material-symbols-outlined icon-label">
                          {{ pie_data.categoryIcons[index] }}
                        </span>
                      </td>
                      <td>
                        <p class="char-data-element-label">{{ pie_data.labels[index] }}</p>
                      </td>
                      <td>
                        <p class="char-data-element-data">{{ pie_data.datasets[0].data[index] }} $</p>
                      </td>
                      <td>
                        <p class="char-data-element-data">
                          {{
                            Number(((pie_data.datasets[0].data[index] / (isIncomePage ? pie_data.income_amount : pie_data.expense_amount)) * 100).toFixed(1))
                          }}
                          %
                        </p>
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
import {ref, computed, onMounted} from 'vue';
import {Doughnut} from 'vue-chartjs';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import '../styles/DashboardPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const sort = ref('');
const transaction_category_id = ref(0);
const transaction_description = ref('');
const transaction_date = ref(new Date().toISOString().slice(0, 10));
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
  axios.post('http://localhost:3000/add_transaction', null, {
    params: {
      category_id: transaction_category_id.value,
      description: transaction_description.value,
      date: transaction_date.value,
      amount: transaction_amount.value
    }
  })
      .then(response => {
        get_transactions_data();
        get_transactions_piechar_data(isIncomePage.value);
      });
}

function get_transactions_data() {
  axios.get('http://localhost:3000/get_transactions')
      .then(response => {
        transactions.value = response.data;
      });
}

function get_categories_data() {
  axios.get('http://localhost:3000/get_categories')
      .then(response => {
        categories.value = response.data;
      });
}

function get_transactions_piechar_data(isIncome) {
  axios.get('http://localhost:3000/get_transactions_piechart_data', {params: {is_income: isIncome}}).then(response => {
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

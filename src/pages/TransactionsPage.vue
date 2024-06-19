<template>
  <div class="header-container">
    <SortComponent
        :initialSort="sort"
        :initialCustomStartDate="customStartDate"
        :initialCustomEndDate="customEndDate"
        :transactions="transactions"
        @sortChange="setSort"
        @filteredTransactions="updateFilteredTransactions"
    />
    <AddTransactionButton @toggleModal="toggleAddTransactionModal" />
  </div>

  <Modal name="m1" v-model:visible="show_add_transaction_modal" :modalClass="'custom-modal'"
         :title="editMode ? 'Edit Transaction' : 'Add Transaction'" :maskClosable="false" :closable="false"
         :cancelButton="{text: 'Cancel', onclick: () => { cancelEditTransaction() }, loading: false}"
         :okButton="{text: editMode ? 'Save Changes' : 'Add Transaction +', onclick: () => { editMode ? save_edited_transaction() : add_transaction() }, loading: false}">
    <div>
      <div class="form-group">
        <DisplayTypeButtons :isIncomePage="transaction_is_income" @changeDashboardPage="changeTransactionType" />
        <br/>
        <select class="form-select" aria-label="Select transaction" v-model="transaction_category_id">
          <option :value="0" selected>Select transaction category</option>
          <option v-if="transaction_is_income" v-for="category in categories.filter(property => property.isIncome)"
                  :value="category.id">{{ category.name }}
          </option>
          <option v-if="!transaction_is_income" v-for="category in categories.filter(property => !property.isIncome)"
                  :value="category.id">{{ category.name }}
          </option>
        </select>
        <div class="input-group my-3">
          <input type="text" class="form-control" v-model="transaction_description" placeholder="Input description"/>
        </div>
        <div class="input-group my-3">
          <input type="date" class="form-control" v-model="transaction_date" placeholder="Transaction date"/>
        </div>
        <div class="input-group my-3">
          <input type="number" class="form-control" v-model="transaction_amount" placeholder="Input amount $"/>
        </div>
      </div>
    </div>
  </Modal>

  <TransactionsTable
      :transactions="filteredTransactions"
      :categories="categories"
      :currentPage="currentPage"
      :itemsPerPage="itemsPerPage"
      :get_category_name_by_id="get_category_name_by_id"
      :formatISODateToDateTime="formatISODateToDateTime"
      :edit_transaction="edit_transaction"
      :confirm_delete_transaction="confirm_delete_transaction"
  />

  <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      :nextPage="nextPage"
      :prevPage="prevPage"
  />
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { Modal } from 'usemodal-vue3';
import { format } from 'date-fns';
import AddTransactionButton from '@/components/ui/AddButton.vue';
import SortComponent from '@/components/SortComponent.vue';
import TransactionsTable from '@/components/TransactionsTable.vue';
import Pagination from '@/components/Pagination.vue';
import DisplayTypeButtons from '@/components/ui/DisplayTypeButtons.vue';

const sort = ref('');
const transaction_category_id = ref(0);
const transaction_description = ref('');
const transaction_date = ref(new Date().toISOString().slice(0, 10));
const transaction_amount = ref();
const transaction_is_income = ref(false);
const transactions = ref([]);
const categories = ref([]);
const show_add_transaction_modal = ref(false);
const editMode = ref(false);
const selectedTransactionId = ref(null);
const filteredTransactions = ref([]);
const customStartDate = ref('');
const customEndDate = ref('');

onMounted(() => {
  get_categories_data();
  get_transactions_data();
});

function toggleAddTransactionModal() {
  show_add_transaction_modal.value = !show_add_transaction_modal.value;
}

function add_transaction() {
  toggleAddTransactionModal();
  save_transaction_to_db();
}

function save_transaction_to_db() {
  axios.post('http://localhost:3000/add_transaction', null, {
    params: {
      category_id: transaction_category_id.value,
      description: transaction_description.value,
      date: transaction_date.value,
      amount: transaction_amount.value,
      is_income: transaction_is_income.value
    }
  })
      .then(response => {
        get_transactions_data();
        reset_transaction_form();
      }).catch(error => {
    handle_error(error);
  });
}

function reset_transaction_form() {
  transaction_category_id.value = 0;
  transaction_description.value = '';
  transaction_date.value = new Date().toISOString().slice(0, 10);
  transaction_amount.value = '';
  transaction_is_income.value = false;
}

function handle_error(error) {
  if (error.response && error.response.data && error.response.data.error) {
    alert(error.response.data.error);
  } else {
    alert('An error occurred: ' + error.message);
  }
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

function confirm_delete_transaction(id) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    delete_transaction(id);
  }
}

function delete_transaction(id) {
  axios.delete('http://localhost:3000/delete_transaction', {
    params: {
      id: id
    }
  })
      .then(response => {
        get_transactions_data();
      });
}

function get_category_name_by_id(id) {
  let elem = categories.value.find(category => category.id == id);
  return elem ? elem.name : '';
}

function setSort(value) {
  sort.value = value;
}

function updateFilteredTransactions(transactions) {
  filteredTransactions.value = transactions;
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

function edit_transaction(id) {
  const selectedTransaction = transactions.value.find(transaction => transaction.id === id);
  if (selectedTransaction) {
    editMode.value = true;
    show_add_transaction_modal.value = true;
    selectedTransactionId.value = id;
    transaction_category_id.value = selectedTransaction.categoryId;
    transaction_description.value = selectedTransaction.description;
    transaction_date.value = selectedTransaction.date.slice(0, 10);
    transaction_amount.value = selectedTransaction.amount;
    transaction_is_income.value = selectedTransaction.isIncome;
  }
}

function cancelEditTransaction() {
  editMode.value = false;
  show_add_transaction_modal.value = false;
}

function save_edited_transaction() {
  editMode.value = false;
  show_add_transaction_modal.value = false;
  const id = selectedTransactionId.value;
  axios.put('http://localhost:3000/edit_transaction', null, {
    params: {
      id: id,
      category_id: transaction_category_id.value,
      description: transaction_description.value,
      date: transaction_date.value,
      amount: transaction_amount.value,
      is_income: transaction_is_income.value
    }
  })
      .then(response => {
        get_transactions_data();
      }).catch(error => {
    handle_error(error);
  });
}

function formatISODateToDateTime(isoDateString) {
  const dateTime = new Date(isoDateString);
  return format(dateTime, 'dd-MM-yyyy HH:mm');
}

function changeTransactionType(new_value) {
  transaction_is_income.value = new_value;
  transaction_category_id.value = 0;
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
}

.display-type-buttons-transaction {
  display: flex;
  justify-content: center;
}

.display-type-buttons-container-transaction {
  background-color: #edeef2;
  border-radius: 20px;
}

.btn-display-type-transaction {
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

.btn-display-type-transaction:hover {
  background-color: #e0e1e6;
}

.btn-display-type-selected-transaction {
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

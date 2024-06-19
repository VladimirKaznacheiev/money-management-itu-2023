<template>
  <div class="transaction-table-container">
    <div class="row">
      <div class="col">
        <table class="table">
          <thead>
          <tr class="table-secondary">
            <th scope="col"></th>
            <th scope="col" @click="sortTable('category')">Category</th>
            <th scope="col" @click="sortTable('description')">Description</th>
            <th scope="col" @click="sortTable('date')">Date</th>
            <th scope="col" @click="sortTable('amount')">Amount</th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="transaction in sortedTransactions" :key="transaction.id">
            <td>
                <span v-if="transaction.isIncome" class="material-symbols-outlined arrow-up">
                  keyboard_double_arrow_up
                </span>
              <span v-else class="material-symbols-outlined arrow-down">
                  keyboard_double_arrow_down
                </span>
            </td>
            <td>{{ truncateText(get_category_name_by_id(transaction.categoryId), 15) }}</td>
            <td>{{ truncateText(transaction.description, 20) }}</td>
            <td>{{ formatISODateToDateTime(transaction.date) }}</td>
            <td>{{ transaction.amount }} $</td>
            <td class="action-buttons">
              <button @click="edit_transaction(transaction.id)" class="btn-edit">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button @click="confirm_delete_transaction(transaction.id)" class="btn-delete">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  transactions: Array,
  categories: Array,
  currentPage: Number,
  itemsPerPage: Number,
  get_category_name_by_id: Function,
  formatISODateToDateTime: Function,
  edit_transaction: Function,
  confirm_delete_transaction: Function,
});

const sortBy = ref('');
const sortOrder = ref('asc');

const sortTable = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortOrder.value = 'asc';
  }
};

const sortedTransactions = computed(() => {
  let sortedArray = [...props.transactions];

  if (sortBy.value) {
    sortedArray.sort((a, b) => {
      let aValue = a[sortBy.value];
      let bValue = b[sortBy.value];

      if (sortBy.value === 'category') {
        aValue = props.get_category_name_by_id(a.categoryId);
        bValue = props.get_category_name_by_id(b.categoryId);
      } else if (sortBy.value === 'date') {
        aValue = new Date(a.date);
        bValue = new Date(b.date);
      }

      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return sortedArray.slice((props.currentPage - 1) * props.itemsPerPage, props.currentPage * props.itemsPerPage);
});

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
</script>

<style scoped>
.transaction-table-container {
  margin: 20px 30px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
  cursor: pointer;
}

.table th {
  background-color: transparent;
  font-weight: bold;
}

.table tbody tr:nth-child(odd) {
  background-color: #f2f2f2;
}

.table tbody tr:hover {
  background-color: #e9ecef;
}

.btn-edit, .btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin: 0 2px;
  visibility: hidden;
}

.table tbody tr:hover .btn-edit,
.table tbody tr:hover .btn-delete {
  visibility: visible;
}

.btn-edit:hover {
  color: #007bff;
}

.btn-delete:hover {
  color: #dc3545;
}

.arrow-up {
  color: green;
}

.arrow-down {
  color: red;
}

.action-buttons {
  display: flex;
  justify-content: center;
}
</style>

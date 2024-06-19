<template>
  <div class="filter-container">
    <label for="sort">Sort by:</label>
    <select id="sort" v-model="sort" @change="emitSortChange">
      <option value="">None</option>
      <option value="Week">This Week</option>
      <option value="Month">This Month</option>
      <option value="Year">This Year</option>
      <option value="Custom">Custom Period</option>
    </select>
    <div v-if="sort === 'Custom'" class="custom-date-range">
      <label for="startDate">From:</label>
      <input type="date" id="startDate" v-model="customStartDate">
      <label for="endDate">To:</label>
      <input type="date" id="endDate" v-model="customEndDate">
      <button @click="applyCustomDateRange">Apply</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  initialSort: String,
  initialCustomStartDate: String,
  initialCustomEndDate: String,
  transactions: Array
});
const emit = defineEmits(['sortChange', 'filteredTransactions']);

const sort = ref(props.initialSort || '');
const customStartDate = ref(props.initialCustomStartDate || '');
const customEndDate = ref(props.initialCustomEndDate || '');
const filteredTransactions = ref([]);

const emitSortChange = () => {
  emit('sortChange', sort.value);
};

const applyCustomDateRange = () => {
  if (customStartDate.value && customEndDate.value) {
    filterTransactions();
  }
};

const filterTransactions = () => {
  let result = [];
  switch (sort.value) {
    case 'Week':
      result = filterTransactionsByWeek(props.transactions);
      break;
    case 'Month':
      result = filterTransactionsByMonth(props.transactions);
      break;
    case 'Year':
      result = filterTransactionsByYear(props.transactions);
      break;
    case 'Custom':
      result = filterTransactionsByDateRange(props.transactions, new Date(customStartDate.value), new Date(customEndDate.value));
      break;
    default:
      result = props.transactions;
  }
  filteredTransactions.value = result;
  emit('filteredTransactions', filteredTransactions.value);
};

const filterTransactionsByWeek = (transactions) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= oneWeekAgo && transactionDate <= now;
  });
};

const filterTransactionsByMonth = (transactions) => {
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= oneMonthAgo && transactionDate <= now;
  });
};

const filterTransactionsByYear = (transactions) => {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= oneYearAgo && transactionDate <= now;
  });
};

const filterTransactionsByDateRange = (transactions, startDate, endDate) => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

watch([sort, customStartDate, customEndDate, () => props.transactions], () => {
  filterTransactions();
}, { immediate: true });

watch(() => props.initialSort, (newSort) => {
  sort.value = newSort;
});

watch(() => props.initialCustomStartDate, (newStartDate) => {
  customStartDate.value = newStartDate;
});

watch(() => props.initialCustomEndDate, (newEndDate) => {
  customEndDate.value = newEndDate;
});
</script>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

label {
  font-weight: bold;
}

select {
  font-size: 16px;
  width: 140px;
  height: 39px;
  color: #333;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  outline: none;
  cursor: pointer;
}

select:hover {
  border-color: #888;
}

select:focus {
  border-color: #555;
}

option {
  padding: 10px;
}

.custom-date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-date-range label {
  margin-bottom: 0;
}

.custom-date-range input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  outline: none;
  cursor: pointer;
}

.custom-date-range input:focus {
  border-color: #555;
}

.custom-date-range button {
  padding: 7px;
  margin: 0 10px;
  font-size: 14px;
  width: 80px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-date-range button:hover {
  background-color: #0056b3;
}

</style>

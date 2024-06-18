<template>
  <div class="dashboard-content">
    <div class="row">
      <SmallCard
          :amount="pie_data.income_amount"
          label="Incomes"
          amountClass="amount-income"
          labelClass="label-income"
      />
      <SmallCard
          :amount="pie_data.expense_amount"
          label="Expenses"
          amountClass="amount-expense"
          labelClass="label-expense"
      />
    </div>

    <div>
      <BigCard>
        <div class="display-type-buttons-container">
          <DisplayTypeButtons :isIncomePage="isIncomePage" @changeDashboardPage="changeDashboardPage" />
        </div>
        <ChartDataList :pieData="pie_data" :isIncomePage="isIncomePage" />
      </BigCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import SmallCard from '@/components/ui/SmallCard.vue';
import BigCard from '@/components/ui/BigCard.vue';
import DisplayTypeButtons from '@/components/ui/DisplayTypeButtons.vue';
import ChartDataList from '@/components/ui/ChartDataList.vue';

const isIncomePage = ref(false);
const pie_data = ref({
  "labels": [],
  "datasets": [
    {
      "backgroundColor": [],
      "data": []
    }
  ],
  "expense_amount": 0,
  "income_amount": 0
});

onMounted(() => {
  get_transactions_piechart_data(isIncomePage.value);
});

function changeDashboardPage(new_value) {
  isIncomePage.value = new_value;
  get_transactions_piechart_data(isIncomePage.value);
}

function get_transactions_piechart_data(isIncome) {
  axios.get('http://localhost:3000/get_transactions_piechart_data', {params: {is_income: isIncome}}).then(response => {
    pie_data.value = response.data;
  });
}
</script>

<style scoped>
.dashboard-content .row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .dashboard-content .row {
    flex-direction: column;
  }
}
</style>

<template>
  <div class="col-sm">
    <div class="card-small">
      <div class="card-content">
        <p :class="amountClass">$ {{ amount }}</p>
        <p :class="labelClass">{{ label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  amountClass: {
    type: String,
    required: true
  },
  labelClass: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.card-small {
  background: #e8e8e8;
  border-radius: 1.5vw;
  text-align: left;
  box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 3%);
  margin-bottom: 1rem;
}

.card-content {
  padding: 1.5vw;
}

.amount-income {
  color: #5864d3;
  font-size: 2vw;
}

.amount-expense {
  color: #da7171;
  font-size: 2vw;
}

.label-income,
.label-expense {
  font-size: 1vw;
}

@media (max-width: 768px) {
  .amount-income,
  .amount-expense {
    font-size: 4vw;
  }

  .label-income,
  .label-expense {
    font-size: 2vw;
  }
}
</style>


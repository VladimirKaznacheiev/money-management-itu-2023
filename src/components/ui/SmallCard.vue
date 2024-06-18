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
  background: #E7E8EB;
  border-radius: 2vw;
  height: 12vh;
  margin-left: 3vw;
  margin-right: 3vw;
  text-align: left;
  box-shadow: 0px 5px 10px lightgrey;
}

.card-content {
  margin-left: 2vw;
  padding-top: 0.5vw;
  padding-bottom: 0.5vw;
}

.amount-income {
  color: #5864d3;
  font-size: 2.2vw;
}

.label-income {
  font-size: 1vw;
  margin-top: -0.5vw;
}

.amount-expense {
  color: #da7171;
  font-size: 2.2vw;
}

.label-expense {
  font-size: 1vw;
  margin-top: -0.5vw;
}
</style>

<template>
  <div class="container">
    <div class="tabs">
      <input type="radio" id="radio-expenses" name="tabs" :checked="!isIncomePage" @change="changeDashboardPage(false)">
      <label class="tab" for="radio-expenses">Expenses</label>
      <input type="radio" id="radio-incomes" name="tabs" :checked="isIncomePage" @change="changeDashboardPage(true)">
      <label class="tab" for="radio-incomes">Incomes</label>
      <span class="glider"></span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isIncomePage: {
    type: Boolean,
    required: true
  }
});

const emits = defineEmits(['changeDashboardPage']);

function changeDashboardPage(new_value) {
  emits('changeDashboardPage', new_value);
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.tabs {
  display: flex;
  position: relative;
  background-color: #fff;
  padding: 0.4rem;
  border-radius: 99px;
}

.tabs * {
  z-index: 2;
}

.container input[type="radio"] {
  display: none;
}

.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 200px;
  font-size: 1rem;
  color: black;
  font-weight: 500;
  border-radius: 99px;
  cursor: pointer;
  transition: color 0.15s ease-in;
}

.container input[type="radio"]:checked + label {
  color: #185ee0;
}

.container input[id="radio-expenses"]:checked ~ .glider {
  transform: translateX(0);
}

.container input[id="radio-incomes"]:checked ~ .glider {
  transform: translateX(200px);
}

.glider {
  position: absolute;
  display: flex;
  height: 40px;
  width: 200px;
  background-color: #e6eef9;
  z-index: 1;
  border-radius: 99px;
  transition: 0.25s ease-out;
}

@media (max-width: 768px) {
  .tab {
    font-size: 0.8rem;
    height: 30px;
    width: 150px;
  }

  .glider {
    height: 30px;
    width: 150px;
  }

  .container input[id="radio-expenses"]:checked ~ .glider {
    transform: translateX(0);
  }

  .container input[id="radio-incomes"]:checked ~ .glider {
    transform: translateX(150px);
  }
}
</style>

<template>
  <div class="app-container">
    <Sidebar :currenyWindowState="currenyWindowState" @update:state="updateState"/>
    <div class="content_area">
      <DashboardPage v-if="currenyWindowState === menuWindowStates.dashboard"/>
      <TransactionsPage v-else-if="currenyWindowState === menuWindowStates.transactions"/>
      <GoalsPage v-else-if="currenyWindowState === menuWindowStates.goals"/>
      <CategoriesPage v-else-if="currenyWindowState === menuWindowStates.categories"/>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Sidebar from './components/Sidebar.vue';
import DashboardPage from './components/DashboardPage.vue';
import TransactionsPage from './components/TransactionsPage.vue';
import GoalsPage from './components/GoalsPage.vue';
import CategoriesPage from './components/CategoriesPage.vue';

const menuWindowStates = ref({
  dashboard: 0,
  transactions: 1,
  goals: 2,
  categories: 3,
});

const currenyWindowState = ref(menuWindowStates.value.dashboard);

const updateState = (state) => {
  currenyWindowState.value = state;
};

watch(currenyWindowState, (newState) => {
  switch (newState) {
    case menuWindowStates.value.dashboard:
      document.title = 'FinanSync - Dashboard';
      break;
    case menuWindowStates.value.transactions:
      document.title = 'FinanSync - Transactions';
      break;
    case menuWindowStates.value.goals:
      document.title = 'FinanSync - Goals';
      break;
    case menuWindowStates.value.categories:
      document.title = 'FinanSync - Categories';
      break;
    default:
      document.title = 'FinanSync';
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.app-container {
  display: flex;
  height: 100vh;
}

.content_area {
  width: 85%;
  padding: 1rem;
  overflow-y: auto;
}
</style>

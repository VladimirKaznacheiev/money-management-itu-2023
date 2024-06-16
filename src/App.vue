<template>
  <div class="app-container">
    <Navbar :currenyWindowState="currenyWindowState" @toggleSidebar="toggleSidebar" @updateState="updateState" />
    <div class="main-content">
      <Sidebar :currenyWindowState="currenyWindowState" :isCollapsed="isSidebarCollapsed" @update:state="updateState" />
      <div class="content_area" :class="{ 'content_area_full': !isSidebarVisible }">
        <DashboardPage v-if="currenyWindowState === menuWindowStates.dashboard" />
        <TransactionsPage v-else-if="currenyWindowState === menuWindowStates.transactions" />
        <GoalsPage v-else-if="currenyWindowState === menuWindowStates.goals" />
        <CategoriesPage v-else-if="currenyWindowState === menuWindowStates.categories" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Navbar from './components/Navbar.vue';
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
const isSidebarVisible = ref(true);
const isSidebarCollapsed = ref(false);

const updateState = (state) => {
  currenyWindowState.value = state;
};

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
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
  flex-direction: column;
  height: 100vh;
}

.main-content {
  display: flex;
  flex-direction: row;
  margin-top: 77px; /* Adjust based on Navbar height */
  height: calc(100vh - 77px);
}

.content_area {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  transition: width 0.3s;
}

.content_area_full {
  width: 100%;
}
</style>

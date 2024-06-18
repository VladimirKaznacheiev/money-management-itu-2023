<template>
  <div class="app-container">
    <Navbar :currenyWindowState="currenyWindowState" @toggleSidebar="toggleSidebar" @updateState="updateState" />
    <div class="main-content">
      <Sidebar :currenyWindowState="currenyWindowState" :isCollapsed="isSidebarCollapsed" @update:state="updateState" />
      <div :class="['content_area', { 'content_area_full': !isSidebarVisible, 'content_area_mobile': isMobileView }]" :style="contentAreaStyle">
        <DashboardPage v-if="currenyWindowState === menuWindowStates.dashboard" />
        <TransactionsPage v-else-if="currenyWindowState === menuWindowStates.transactions" />
        <GoalsPage v-else-if="currenyWindowState === menuWindowStates.goals" />
        <CategoriesPage v-else-if="currenyWindowState === menuWindowStates.categories" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import DashboardPage from '@/pages/DashboardPage.vue';
import TransactionsPage from '@/pages/TransactionsPage.vue';
import GoalsPage from '@/pages/GoalsPage.vue';
import CategoriesPage from '@/pages/CategoriesPage.vue';

const menuWindowStates = ref({
  dashboard: 0,
  transactions: 1,
  goals: 2,
  categories: 3,
});

const currenyWindowState = ref(menuWindowStates.value.dashboard);
const isSidebarVisible = ref(true);
const isSidebarCollapsed = ref(false);
const isMobileView = ref(false);

const updateState = (state) => {
  currenyWindowState.value = state;
};

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const handleResize = () => {
  if (window.innerWidth < 768) {
    isSidebarCollapsed.value = true;
    isMobileView.value = true;
  } else {
    isSidebarCollapsed.value = false;
    isMobileView.value = false;
  }
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

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

watch(isSidebarCollapsed, (newVal) => {
  isSidebarVisible.value = !newVal;
});

const contentAreaStyle = computed(() => {
  return {
    marginLeft: isSidebarCollapsed.value ? '95px' : '300px'
  };
});
</script>

<style>
#app {
  font-family: "Google Sans", sans-serif;
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
  margin-top: 80px;
  height: calc(100vh - 80px);
}

.content_area {
  flex-grow: 1;
  padding: 1.5rem;
  overflow-y: auto;
  transition: margin-left 0.3s;
}

.content_area_full {
  width: 100%;
}

.content_area_mobile {
  padding: 1.5rem;
  flex-direction: column;
}

@media (max-width: 768px) {
  .content_area {
    padding: 0.5rem;
  }
}
</style>

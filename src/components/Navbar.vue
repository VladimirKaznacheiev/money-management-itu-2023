<template>
  <nav class="navbar">
    <div class="hamburger" @click="handleToggleSidebar">
      <span class="material-symbols-outlined" style="font-size: 2.5rem; user-select: none;">menu</span>
    </div>
    <div class="navbar-logo" @click="goToDashboard">
      <img src="@/assets/logo.png" style="user-select: none;" alt="Logo" />
      <span class="app-name" style="user-select: none;">FinanSync</span>
    </div>
    <div class="page-title">
      {{ pageTitle }}
    </div>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currenyWindowState: Number,
});

const emit = defineEmits(['toggleSidebar', 'updateState']);

const menuWindowStates = ref({
  dashboard: 0,
  transactions: 1,
  goals: 2,
  categories: 3,
});

const pageTitle = ref('Dashboard');

watch(() => props.currenyWindowState, (newState) => {
  switch (newState) {
    case menuWindowStates.value.dashboard:
      pageTitle.value = 'Dashboard';
      break;
    case menuWindowStates.value.transactions:
      pageTitle.value = 'Transactions';
      break;
    case menuWindowStates.value.goals:
      pageTitle.value = 'Goals';
      break;
    case menuWindowStates.value.categories:
      pageTitle.value = 'Categories';
      break;
    default:
      pageTitle.value = 'FinanSync';
  }
});

const handleToggleSidebar = () => {
  emit('toggleSidebar');
};

const goToDashboard = () => {
  emit('updateState', menuWindowStates.value.dashboard);
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  padding: 1rem;
  z-index: 1000;
}

.hamburger {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.5s ease;
}

.hamburger:hover {
  background-color: #f5f5f5;
  border-radius: 50%;
}

.hamburger:active {
  background-color: #e6e6e6;
}

.navbar-logo {
  display: flex;
  align-items: center;
  padding-left: 2rem;
  cursor: pointer;
}

.navbar-logo img {
  width: 45px;
  margin-right: 0.5rem;
}

.app-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.page-title {
  font-size: 1.5rem;
  padding-left: 2rem;
  text-align: left;
}

@media (max-width: 768px) {
  .app-name {
    display: none;
  }
}
</style>

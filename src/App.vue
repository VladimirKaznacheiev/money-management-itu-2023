<!--
    File: App.vue
    Authors: Volodymyr Burylov
             Volodymyr Kaznacheiev,
             Maksim Kalutski
    Date: 05/12/2023
-->

<template>
  <div class="app-container">
    <div class="left_navbar">
      <div class="logo_container">
        <img class="logo" src="./assets/logo.png" alt="SVG Image"/>
        <div class="app_name">FinanSync</div>
      </div>
      <div class="menu_buttons_block">
        <div
            class="menu_button"
            @click="currenyWindowState = menuWindowStates.dashboard"
            :class="{ selected_menu_button: currenyWindowState === menuWindowStates.dashboard }"
        >
          <div class="menu_button_content">
            <span class="material-symbols-outlined">dashboard</span>
            <div class="menu_button_text">Dashboard</div>
          </div>
        </div>

        <div
            class="menu_button"
            @click="currenyWindowState = menuWindowStates.transactions"
            :class="{ selected_menu_button: currenyWindowState === menuWindowStates.transactions }"
        >
          <div class="menu_button_content">
            <span class="material-symbols-outlined">attach_money</span>
            <div class="menu_button_text">Transactions</div>
          </div>
        </div>

        <div
            class="menu_button"
            @click="currenyWindowState = menuWindowStates.goals"
            :class="{ selected_menu_button: currenyWindowState === menuWindowStates.goals }"
        >
          <div class="menu_button_content">
            <span class="material-symbols-outlined">flag</span>
            <div class="menu_button_text">Goals</div>
          </div>
        </div>

        <div
            class="menu_button"
            @click="currenyWindowState = menuWindowStates.categories"
            :class="{ selected_menu_button: currenyWindowState === menuWindowStates.categories }"
        >
          <div class="menu_button_content">
            <span class="material-symbols-outlined">shopping_basket</span>
            <div class="menu_button_text">Categories</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content_area">
      <DashboardPage v-if="currenyWindowState === menuWindowStates.dashboard"/>
      <TransactionsPage v-else-if="currenyWindowState === menuWindowStates.transactions"/>
      <GoalsPage v-else-if="currenyWindowState === menuWindowStates.goals"/>
      <CategoriesPage v-else-if="currenyWindowState === menuWindowStates.categories"/>
    </div>
  </div>
</template>

<script setup>
import DashboardPage from './components/DashboardPage.vue';
import TransactionsPage from './components/TransactionsPage.vue';
import GoalsPage from './components/GoalsPage.vue';
import CategoriesPage from './components/CategoriesPage.vue';
import {ref, watch} from 'vue';
import './styles/App.css';

const menuWindowStates = ref({
  dashboard: 0,
  transactions: 1,
  goals: 2,
  categories: 3,
});

const currenyWindowState = ref(menuWindowStates.value.dashboard);

document.title = 'FinanSync - Dashboard';

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
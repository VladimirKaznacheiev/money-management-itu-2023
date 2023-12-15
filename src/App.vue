<template>

  <div>

    <div class="row" style="height: 100vh;">
     
      <div class="left_navbar" style="background-color: #E7E8EB; width: 15%;">
        <img class="mt-4" src="./assets/logo.png" alt="SVG Image"/>
        <div class="menu_buttons_block" style="margin-top: 100px">

        <div class="menu_button" @click="currenyWindowState = menuWindowStates.dashboard" :class="[currenyWindowState == menuWindowStates.dashboard ? 'selected_menu_button' : '']" >
          <div class="menu_button_content">
            <span class="material-symbols-outlined" style="font-size: 30px;">dashboard</span>
            <div class="menu_button_text">Dashboard</div>
          </div>
        </div>
  
        <div class="menu_button" @click="currenyWindowState = menuWindowStates.transactions" :class="[currenyWindowState == menuWindowStates.transactions ? 'selected_menu_button' : '']">
          <div class="menu_button_content">
            <span class="material-symbols-outlined" style="font-size: 30px;">attach_money</span>
            <div class="menu_button_text">Transactions</div>
          </div>
        </div>
  
        <div class="menu_button" @click="currenyWindowState = menuWindowStates.goals" :class="[currenyWindowState == menuWindowStates.goals ? 'selected_menu_button' : '']">
          <div class="menu_button_content">
            <span class="material-symbols-outlined" style="font-size: 30px;">flag </span>
            <div class="menu_button_text">Goals</div>
          </div>
        </div>

        <div class="menu_button" @click="currenyWindowState = menuWindowStates.categories" :class="[currenyWindowState == menuWindowStates.categories ? 'selected_menu_button' : '']">
          <div class="menu_button_content">
            <span class="material-symbols-outlined" style="font-size: 30px;">shopping_basket</span>
            <div class="menu_button_text">Categories</div>
          </div>
        </div>
  

      </div>

     </div> 
     <div style="width: 85%;">
       <div class="col m-0">

         <DashboardPage v-if="currenyWindowState == menuWindowStates.dashboard"/>
         <TransactionsPage v-else-if="currenyWindowState == menuWindowStates.transactions"/>
         <GoalsPage v-else-if="currenyWindowState == menuWindowStates.goals"/>
         <CategoriesPage v-else-if="currenyWindowState == menuWindowStates.categories"/>
       </div>
     </div>
   
    </div>
  </div>
</template>

<!-- <script src="sidebars.js"></script>     -->

<script setup>
import DashboardPage from './components/DashboardPage.vue'
import TransactionsPage from './components/TransactionsPage.vue'
import GoalsPage from './components/GoalsPage.vue'
import CategoriesPage from './components/CategoriesPage.vue'

import { ref } from 'vue'

const menuWindowStates = ref({
  dashboard: 0,
  transactions: 1,
  goals: 2,
  categories: 3,
});

const currenyWindowState = ref(menuWindowStates.value.dashboard);


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.menu_button {
  width: 90%;
  height: 60px;
  margin: 15px;
  padding: 15px;
  margin-bottom: 25px;  
  border-radius: 40px;
  transition: background-color 0.5s ease;
  display: flex;
  cursor: pointer;
}

.menu_button:hover {
  background-color: #C6E7FF;
}

.selected_menu_button {
  background-color: #C6E7FF;
}


.menu_button_text {
  margin-top: 3px;
  font-size: 17px;
  font-weight: bold;
  margin-left: 10px;
}

.menu_button_content {
  display: flex;
  width: 100%;

}
</style>

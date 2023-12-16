<template>

  <div>

    <div class="row" style="height: 100vh;">
     
      <div class="left_navbar" style="background-color: #E7E8EB; width: 15%;">
        <img class="mt-4" src="./assets/logo.png" alt="SVG Image" width="80%"/>
        <div class="menu_buttons_block" style="margin-top: 5vw">

        <div class="menu_button" @click="currenyWindowState = menuWindowStates.dashboard" :class="[currenyWindowState == menuWindowStates.dashboard ? 'selected_menu_button' : '']" >
          <div class="menu_button_content">
            <span class="material-symbols-outlined" style="font-size: 1.2vw">dashboard</span>
            <div class="menu_button_text">Dashboard</div>
          </div>
        </div>
  
        <div class="menu_button" @click="currenyWindowState = menuWindowStates.transactions" :class="[currenyWindowState == menuWindowStates.transactions ? 'selected_menu_button' : '']">
          <div class="menu_button_content">
            <span class="material-symbols-outlined" style="font-size: 1.2vw;">attach_money</span>
            <div class="menu_button_text">Transactions</div>
          </div>
        </div>
  
        <div class="menu_button" @click="currenyWindowState = menuWindowStates.goals" :class="[currenyWindowState == menuWindowStates.goals ? 'selected_menu_button' : '']">
          <div class="menu_button_content">
            <span class="material-symbols-outlined" style="font-size: 1.2vw;">flag </span>
            <div class="menu_button_text">Goals</div>
          </div>
        </div>

        <div class="menu_button" @click="currenyWindowState = menuWindowStates.categories" :class="[currenyWindowState == menuWindowStates.categories ? 'selected_menu_button' : '']">
          <div class="menu_button_content">
            <span class="material-symbols-outlined" style="font-size: 1.2vw;">shopping_basket</span>
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
// import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch  } from 'vue'

const menuWindowStates = ref({
  dashboard: 0,
  transactions: 1,
  goals: 2,
  categories: 3,
});

const currenyWindowState = ref(menuWindowStates.value.dashboard);


// const route = useRoute();
// const myRoute = ref(route)
// const router = useRouter();


// watch(() => {
//   // if (route){
//     myRoute.value = route
//     console.log('Current Route:', myRoute);
//     open_current_window();
//   // }
// })



// function open_current_window() {
//   console.log('Current Route:', myRoute.path);
//   if (myRoute.path == "/dashboard") {
//     currenyWindowState.value = menuWindowStates.value.dashboard;
//   } else if (myRoute.path == "/transactions") {
//     currenyWindowState.value = menuWindowStates.value.transactions;
//   } else if (myRoute.path == "/goals") {
//     currenyWindowState.value = menuWindowStates.value.goals;
//   } else if (myRoute.path == "/categories") {
//     currenyWindowState.value = menuWindowStates.value.categories;
//   }
// }

// onMounted(() => {
//   open_current_window();
// });


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
  height: 3vw;
  margin: 1vw;
  padding: 1vw;
  margin-bottom: 1.2vw;  
  border-radius: 40px;
  transition: background-color 0.5s ease;
  display: flex;
  cursor: pointer;
}

.menu_button:hover {
  background-color: #d6eeff;
}

.selected_menu_button {
  background-color: #C6E7FF;
}


.menu_button_text {
  font-size: 0.8vw;
  font-weight: bold;
  margin-left: 0.8vw;
}

.menu_button_content {
  display: flex;
  width: 100%;

}
</style>

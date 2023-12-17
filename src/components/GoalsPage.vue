<template>
    <div>
      <h1 style="text-align: left; margin-left: 30px; margin-top: 30px; color: rgba(0,0,0,0.5);">
        Goals
      </h1>
      <div style="display: flex; align-items: left; margin-top: 1.5vw;">
        <button class="btn btn-primary" type="submit" style="display: flex; align-items: center; margin-left: auto;margin-right: 40px; font-size: 16px;" @click="show_add_goal_modal = !show_add_goal_modal">
          <span class="material-symbols-outlined">add</span>
          Add new goal
        </button>
        <Modal name="m1" v-model:visible="show_add_goal_modal" :modalClass="'custom-modal'" :title="'Add Transaction'" :maskClosable="false" :closable="false" :cancelButton="{text: 'cancel', onclick: () => {show_add_goal_modal = !show_add_goal_modal}, loading: false}" :okButton="{text: 'Add transaction +', onclick: () => {add_goal();}, loading: false}">
          <div>
            <div class="display-type-buttons-transaction">
              <div class="display-type-buttons-container-transaction">
                <button type="button" :class="[!goal_is_spend ? 'btn-display-type-selected-transaction' : 'btn-display-type-transaction']" @click="goal_is_spend = false">Spend</button>
                <button type="button" :class="[goal_is_spend ? 'btn-display-type-selected-transaction' : 'btn-display-type-transaction']" @click="goal_is_spend = true">Save</button>
              </div>
            </div>
            <br/>
            <div class="input-group my-3">
              <input type="text" class="form-control" v-model="goal_name" placeholder="Input name" />
            </div>
            <select class="form-select" aria-label="Select transaction example" v-model="goal_category_id">
              <option :value="0" selected>Select goal category</option>
              <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
            </select>
            <div class="input-group my-3">
              <input type="date" class="form-control" v-model="goal_date" placeholder="Goal date" />
            </div>
            <div class="input-group my-3">
              <input type="number" class="form-control" v-model="goal_amount" placeholder="Input amount $" />
            </div>
          </div>
        </Modal>
        <Modal
            v-model:visible="showGoalModal"
            :modalClass="'custom-modal'"
            :title="'Goal Information'"
            :maskClosable="false"
            :closable="false"
            :cancelButton="{ text: 'Close', onclick: closeGoalModal, loading: false }"
            :okButton="{ text: 'Edit', onclick: editGoal, buttonClass: 'btn-delete', loading: false }">
            <div>
            <h2>{{ goalToDisplay.name }}</h2>
            <p>{{ get_category_name_by_id(goalToDisplay.categoryId) }}</p>
            <p>${{ goalToDisplay.amount }}</p>
            <p>Due to: {{ formatISODateToDateTime(goalToDisplay.date) }}</p>


            <button @click="deleteGoal()" class="btn-delete">Delete</button>
          </div>
        </Modal>
      </div>
      <div class="goal-cards-container">
        <div class="goal-card" v-for="goal in goals" :key="goal.id" @click="openGoalModal(goal)">
          <div class="goal-card-content">

            <p class="goal-card-content-header">
              {{ goal.name }}
            </p>
            
            <p class="goal-card-content-text" >
              {{ goal.isSpend ? 'Spend' : 'Save' }} ${{ goal.amount }} on category: {{ get_category_name_by_id(goal.categoryId) }}
            </p>
            <p class="goal-card-content-text" style="font-weight: bold;">
              123$ / {{goal.amount}}$
            </p>

            <div style="background: grey; height: 0.3vw; margin-right: 1.5vw; border-radius: 1vw;">
              <div style="background: #00658b; height: 0.3vw; border-radius: 1vw;" :style="{width: Math.floor((123/ goal.amount)*100)+'%'}">

</div>
            </div>  
            <br/>
            <p class="goal-card-content-text" style="float: right; margin-right: 1vw;">
              Due to: {{ formatISODateToDateTime(currentTime) }}
            </p>
          </div>
            
          </div>

      </div>
    </div>
</template>

<script setup>
import axios from 'axios';

import { ref, computed } from 'vue';

import { onMounted } from 'vue';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {PrismaClient} from "@prisma/client";
import {Modal} from "usemodal-vue3";
import {format} from "date-fns";
ChartJS.register(ArcElement, Tooltip, Legend)
const sort = ref('');
const goal_category_id = ref(0);
const goal_name = ref('');
const goal_date = ref(new Date().toISOString().substr(0, 10));
const goal_amount = ref('');
const goal_is_spend = ref(true);
const show_add_goal_modal = ref(false);
const categories = ref([]);
const goals = ref([]);

const currentTime = ref(new Date());

onMounted(() => {
  get_categories_data();
  get_goals_data();
});

const goalProgress = computed(() => {
  return goals.value.map((goal) => {
    const goalDate = new Date(goal.date);
    const timeDiff = goalDate - currentTime.value;
    const progress = Math.max(0, Math.min(100, (timeDiff / (goalDate - new Date())) * 100));
    return { id: goal.id, progress };
  });
});

function add_goal() {
  show_add_goal_modal.value = !show_add_goal_modal.value;
  save_goal_to_db();
}

function save_goal_to_db() {
    axios.post('http://localhost:3000/add_goal', null, {params  : {
        category_id: goal_category_id.value,
        name: goal_name.value,
        date: goal_date.value,
        amount: goal_amount.value,
        is_spend: goal_is_spend.value
    }})
    .then(response => {
        get_goals_data();
    });
}

function get_goals_data() {

    axios.get('http://localhost:3000/get_goals')
        .then(response => {
            console.log(response)
            goals.value = response.data
        });
}

function get_categories_data() {

  axios.get('http://localhost:3000/get_categories')
      .then(response => {
        console.log(response)
        categories.value = response.data
      });

}

function get_category_name_by_id(id) {
  console.log(id);
  let elem = categories.value.find(category => category.id == id);
  if (elem != null) {
    return elem.name;
  }
}

function delete_goal(id) {
  axios.delete('http://localhost:3000/delete_goal', {params  : {
      id: id
    }})
      .then(response => {
        console.log(response)
        get_goals_data();
      });
}

function edit_goal() {
  axios.put('http://localhost:3000/edit_goal', null, {params  : {
      id: goalToDisplay.id,
      category_id: goalToDisplay.categoryId,
      name: goalToDisplay.name,
      date: goalToDisplay.date,
      amount: goalToDisplay.amount,
      is_spend: goalToDisplay.isSpend
    }})
      .then(response => {
        console.log(response)
        get_goals_data();
      });
}

function formatISODateToDateTime(isoDateString) {
  const dateTime = new Date(isoDateString);
  return format(dateTime, 'MMM d'); // Update the format string here
}

const goalToDisplay = ref({});
const showGoalModal = ref(false);

function openGoalModal(goal) {
  goalToDisplay.value = goal;
  showGoalModal.value = true;
}

function closeGoalModal() {
  showGoalModal.value = false;
}


function deleteGoal() {
  delete_goal(goalToDisplay.value.id);
  showGoalModal.value = false;
}

</script>

<style>

.btn-delete {
  background-color: #ff6961; /* Red color */
  color: white;
  border: none;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.goal-card {
  background: #E7E8EB;
  border-radius: 1vw;
  height: 20vh;
  width: 18vw;
  margin-left: 2vw;
  margin-bottom: 2vw;
  text-align: left;
  box-shadow: 1px 5px 10px lightgrey;
}

.goal-cards-container{
  display: flex;
  flex-wrap: wrap;
  margin-top: 2vw;

}

.goal-card-content{
  margin-left: 1vw;
  margin-top: 1vw;
  /* font-size: 0.5vw; */
}

.goal-card-content-header{
  font-size: 1vw;
  font-weight: bold;
}

.goal-card-content-text{
  font-size: 0.7vw;
  margin-bottom: 0.5vw;
}


</style>

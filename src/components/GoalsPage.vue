<!--
    Name: components/GoalsPage.vue
    Authors: Volodymyr Burylov
             Volodymyr Kaznacheiev
             Maksim Kalutski
    Date: 05/12/2023
-->

<template>
  <div>
    <h1 class="title">Goals</h1>
    <div class="add-goal-button">
      <button class="btn btn-primary" type="submit" @click="show_add_goal_modal = !show_add_goal_modal">
        <span class="material-symbols-outlined">add</span>
        Add new goal
      </button>
      <Modal name="m1" v-model:visible="show_add_goal_modal" :modalClass="'custom-modal'" :title="'Add Goal'"
             :maskClosable="false" :closable="false"
             :cancelButton="{text: 'cancel', onclick: () => {show_add_goal_modal = !show_add_goal_modal}, loading: false}"
             :okButton="{text: 'Add Goal +', onclick: () => {add_goal();}, loading: false}">
        <div>
          <div class="display-type-buttons-transaction">
            <div class="display-type-buttons-container-transaction">
              <button type="button"
                      :class="[goal_is_spend ? 'btn-display-type-selected-transaction' : 'btn-display-type-transaction']"
                      @click="goal_is_spend = true">Spend
              </button>
              <button type="button"
                      :class="[!goal_is_spend ? 'btn-display-type-selected-transaction' : 'btn-display-type-transaction']"
                      @click="goal_is_spend = false">Save
              </button>
            </div>
          </div>
          <br/>
          <div class="input-group my-3">
            <input type="text" class="form-control" v-model="goal_name" placeholder="Input name"/>
          </div>
          <select class="form-select" aria-label="Select transaction example" v-model="goal_category_id">
            <option :value="0" selected>Select goal category</option>
            <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
          </select>
          <div class="input-group my-3">
            <input type="date" class="form-control" v-model="goal_date" placeholder="Goal date"/>
          </div>
          <div class="input-group my-3">
            <input type="number" class="form-control" v-model="goal_amount" placeholder="Input amount $"/>
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
        <div class="goal-info">
          <div class="goal-info-name">
            <p>Name: </p>
            <p class="goal-info-bold"> {{ goalToDisplay.name }}</p>
          </div>
          <div class="goal-info-category">
            <p>
              Spend <b>{{ goalToDisplay.isSpend ? 'more' : 'less' }} than ${{ goalToDisplay.amount }}</b> on category:
              {{ get_category_name_by_id(goalToDisplay.categoryId) }}
            </p>
            <span class="material-symbols-outlined">{{ get_category_icon_by_id(goalToDisplay.categoryId) }}</span>
          </div>
          <p>Due to: {{ formatISODateToDateTime(goalToDisplay.date) }}</p>

          <span @click="deleteGoal()" class="goal-info-delete material-symbols-outlined"> delete </span>

        </div>
      </Modal>
      <Modal
          v-model:visible="showGoalEditModal"
          :modalClass="'custom-modal'"
          :title="'Edit Goal'"
          :maskClosable="false"
          :closable="false"
          :cancelButton="{ text: 'Close', onclick: closeGoalEditModal, loading: false }"
          :okButton="{ text: 'Save', onclick: edit_goal, buttonClass: 'btn-delete', loading: false }">
        <div>
          <div class="display-type-buttons-transaction">
            <div class="display-type-buttons-container-transaction">
              <button type="button"
                      :class="[goal_is_spend ? 'btn-display-type-selected-transaction' : 'btn-display-type-transaction']"
                      @click="goal_is_spend = true">Spend
              </button>
              <button type="button"
                      :class="[!goal_is_spend ? 'btn-display-type-selected-transaction' : 'btn-display-type-transaction']"
                      @click="goal_is_spend = false">Save
              </button>
            </div>
          </div>
          <br/>
          <div class="input-group my-3">
            <input type="text" class="form-control" v-model="goal_name" placeholder="Input name"/>
          </div>
          <select class="form-select" aria-label="Select transaction example" v-model="goal_category_id">
            <option :value="0" selected>Select goal category</option>
            <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
          </select>
          <div class="input-group my-3">
            <input type="date" class="form-control" v-model="goal_date" placeholder="Goal date"/>
          </div>
          <div class="input-group my-3">
            <input type="number" class="form-control" v-model="goal_amount" placeholder="Input amount $"/>
          </div>
        </div>
      </Modal>
    </div>
    <div class="goal-cards-container">
      <div class="goal-card" v-for="goal in goals" :key="goal.id" @click="openGoalModal(goal)">
        <div class="goal-card-content">
          <span class="material-symbols-outlined goal-card-icon">
            {{ get_category_icon_by_id(goal.categoryId) }}
          </span>
          <p class="goal-card-content-header">{{ goal.name }}</p>
          <p class="goal-card-content-text">
            Spend <b>{{ goal.isSpend ? 'more' : 'less' }} than ${{ goal.amount }}</b> on category:
            {{ get_category_name_by_id(goal.categoryId) }}
          </p>
          <p class="goal-card-content-text goal-card-amount">
            {{ goal.spent }}$ / {{ goal.amount }}$
          </p>
          <div class="goal-card-progress-background">
            <div class="goal-card-progress" :style="{width: Math.min(Math.floor((goal.spent/ goal.amount)*100), 100)+'%'}"></div>
          </div>
          <br/>
          <span v-if="(goal.isSpend && goal.spent >= goal.amount) || (!goal.isSpend && goal.spent < goal.amount)"
                class="goal-card-status-done material-symbols-outlined">
            done
          </span>
          <span v-else class="goal-card-status-close material-symbols-outlined">
            close
          </span>
          <p class="goal-card-content-text goal-card-due">
            Due to: {{ formatISODateToDateTime(goal.date) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import {ref, computed, onMounted} from 'vue';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Modal} from "usemodal-vue3";
import {format} from "date-fns";
import '../styles/GoalsPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

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
    return {id: goal.id, progress};
  });
});

function editGoal() {
  goal_category_id.value = goalToDisplay.value.categoryId;
  goal_name.value = goalToDisplay.value.name;

  var originalDate = new Date(goalToDisplay.value.date);
  var year = originalDate.getFullYear();
  var month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
  var day = originalDate.getDate().toString().padStart(2, '0');
  var formattedDateString = `${year}-${month}-${day}`;

  goal_date.value = formattedDateString;
  goal_amount.value = goalToDisplay.value.amount;
  goal_is_spend.value = goalToDisplay.value.isSpend;
  showGoalModal.value = false;
  showGoalEditModal.value = true;
}

function add_goal() {
  show_add_goal_modal.value = !show_add_goal_modal.value;
  save_goal_to_db();
}

function save_goal_to_db() {
  axios.post('http://localhost:3000/add_goal', null, {
    params: {
      category_id: goal_category_id.value,
      name: goal_name.value,
      date: goal_date.value,
      amount: goal_amount.value,
      is_spend: goal_is_spend.value
    }
  })
      .then(response => {
        get_goals_data();

        goal_category_id.value = 0;
        goal_name.value = '';
        goal_date.value = new Date().toISOString().substr(0, 10);
        goal_amount.value = '';
        goal_is_spend.value = true;
      }).catch(error => {
    if (error.response && error.response.data && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert('An error occurred: ' + error.message);
    }
  });
}

function get_goals_data() {
  axios.get('http://localhost:3000/get_goals')
      .then(response => {
        goals.value = response.data;
      });
}

function get_categories_data() {
  axios.get('http://localhost:3000/get_categories')
      .then(response => {
        categories.value = response.data;
      });
}

function get_category_name_by_id(id) {
  let elem = categories.value.find(category => category.id == id);
  if (elem != null) {
    return elem.name;
  }
}

function get_category_icon_by_id(id) {
  let elem = categories.value.find(category => category.id == id);
  if (elem != null) {
    return elem.iconName;
  }
}

function delete_goal(id) {
  axios.delete('http://localhost:3000/delete_goal', {
    params: {
      id: id
    }
  })
      .then(response => {
        get_goals_data();
      });
}

function edit_goal() {
  axios.put('http://localhost:3000/edit_goal', null, {
    params: {
      id: goalToDisplay.value.id,
      category_id: goal_category_id.value,
      name: goal_name.value,
      date: goal_date.value,
      amount: goal_amount.value,
      is_spend: goal_is_spend.value
    }
  })
      .then(response => {
        get_goals_data();
        closeGoalEditModal();
      }).catch(error => {
    if (error.response && error.response.data && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert('An error occurred: ' + error.message);
    }
  });
}

function formatISODateToDateTime(isoDateString) {
  const dateTime = new Date(isoDateString);
  return format(dateTime, 'MMM d');
}

const goalToDisplay = ref({});
const showGoalModal = ref(false);
const showGoalEditModal = ref(false);

function openGoalModal(goal) {
  goalToDisplay.value = goal;
  showGoalModal.value = true;
}

function closeGoalModal() {
  showGoalModal.value = false;
}

function closeGoalEditModal() {
  showGoalEditModal.value = false;
}

function deleteGoal() {
  delete_goal(goalToDisplay.value.id);
  showGoalModal.value = false;
}
</script>

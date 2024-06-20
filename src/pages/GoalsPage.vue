<template>
  <div>
    <div class="add-goal-button">
      <AddButton @toggleModal="show_add_goal_modal = !show_add_goal_modal" />
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
              <span class="glider" :style="{ transform: goal_is_spend ? 'translateX(0)' : 'translateX(200px)' }"></span>
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
            <p class="goal-info-bold ellipsis"> {{ goalToDisplay.name }}</p>
          </div>
          <div class="goal-info-category">
            <p class="goal-info-category-text ellipsis">
              Spend <b>{{ goalToDisplay.isSpend ? 'more' : 'less' }} than ${{ goalToDisplay.amount }}</b> on category:
              <span class="category-name">{{ get_category_name_by_id(goalToDisplay.categoryId) }}</span>
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
              <span class="glider" :style="{ transform: goal_is_spend ? 'translateX(0)' : 'translateX(200px)' }"></span>
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
      <div class="goal-card" v-for="goal in paginatedGoals" :key="goal.id" @click="openGoalModal(goal)">
        <div class="goal-card-content">
          <span class="material-symbols-outlined goal-card-icon">
            {{ get_category_icon_by_id(goal.categoryId) }}
          </span>
          <p class="goal-card-content-header ellipsis">{{ goal.name }}</p>
          <p class="goal-card-content-text ellipsis">
            Spend <b>{{ goal.isSpend ? 'more' : 'less' }} than ${{ goal.amount }}</b> on category:
            {{ get_category_name_by_id(goal.categoryId) }}
          </p>
          <p class="goal-card-content-text goal-card-amount">
            {{ goal.spent }}$ / {{ goal.amount }}$
          </p>
          <div class="goal-card-progress-background">
            <div class="goal-card-progress"
                 :style="{width: Math.min(Math.floor((goal.spent/ goal.amount)*100), 100)+'%'}"></div>
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
    <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        :nextPage="nextPage"
        :prevPage="prevPage"
    />
  </div>
</template>


<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Modal } from "usemodal-vue3";
import { format } from "date-fns";
import AddButton from '../components/ui/AddButton.vue';
import Pagination from '../components/Pagination.vue';

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
const currentPage = ref(1);
const goalsPerPage = 12;

const currentTime = ref(new Date());

onMounted(() => {
  get_categories_data();
  get_goals_data();
});

const totalPages = computed(() => {
  return Math.ceil(goals.value.length / goalsPerPage);
});

const paginatedGoals = computed(() => {
  const start = (currentPage.value - 1) * goalsPerPage;
  const end = start + goalsPerPage;
  return goals.value.slice(start, end);
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

const goalProgress = computed(() => {
  return goals.value.map((goal) => {
    const goalDate = new Date(goal.date);
    const timeDiff = goalDate - currentTime.value;
    const progress = Math.max(0, Math.min(100, (timeDiff / (goalDate - new Date())) * 100));
    return { id: goal.id, progress };
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

<style scoped>

.add-goal-button {
  display: flex;
  margin: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.add-goal-button .btn {
  display: flex;
  align-items: center;
  margin: 1rem;
  font-size: 1rem;
}

.display-type-buttons-transaction {
  display: flex;
  justify-content: center;
  position: relative;
  background-color: #fff;
  padding: 0.4rem;
  border-radius: 99px;
}

.display-type-buttons-transaction * {
  z-index: 2;
}

.display-type-buttons-container-transaction {
  display: flex;
  position: relative;
  background-color: #fff;
  padding: 0.4rem;
  border-radius: 99px;
}

.display-type-buttons-container-transaction * {
  z-index: 2;
}

.btn-display-type-transaction {
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
  transition: color 0.15s ease-in, background-color 0.25s ease-out;
  background-color: transparent;
  border: none;
}

.btn-display-type-transaction:hover {
  background-color: #e0e1e6;
}

.btn-display-type-selected-transaction {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 200px;
  font-size: 1rem;
  color: #185ee0;
  font-weight: 500;
  border-radius: 99px;
  cursor: pointer;
  transition: color 0.15s ease-in, background-color 0.25s ease-out;
  background-color: #e6eef9;
  border: none;
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

.goal-info {
  text-align: left;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.goal-info-name {
  display: flex;
  flex-wrap: wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.goal-info-bold {
  font-weight: bold;
  margin-left: 0.5rem;
  flex: 1;
}

.goal-info-category {
  display: flex;
  flex-wrap: wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.goal-info-category-text {
  flex: 1;
  display: inline-block;
  max-width: calc(100% - 2rem);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goal-info-delete {
  color: red;
  cursor: pointer;
}

.btn-delete {
  background-color: #ff6961;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin: 0.25rem 0.5rem;
  cursor: pointer;
  border-radius: 4px;
}

.goal-card {
  border: 2px solid #b5bfd9;
  background-color: #fff;
  height: auto;
  width: 18vw;
  min-width: 250px;
  margin: 1rem;
  text-align: left;
  border-radius: 1.5rem;
  box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 3%);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: box-shadow 0.15s ease;
}

.goal-card:hover {
  box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 10%);
}

.goal-cards-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 2vw;
  justify-content: center;
}

.goal-card-content {
  padding: 1rem;
}

.goal-card-icon {
  float: right;
  margin-right: 1rem;
  font-size: 2rem;
}

.goal-card-content-header {
  font-size: 1.2rem;
  font-weight: bold;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.goal-card-content-text {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.goal-card-amount {
  font-weight: bold;
}

.goal-card-progress-background {
  background: grey;
  height: 0.3rem;
  margin-right: 1.5rem;
  border-radius: 1rem;
}

.goal-card-progress {
  background: #00658b;
  height: 0.3rem;
  border-radius: 1rem;
}

.goal-card-status-done {
  color: green;
}

.goal-card-status-close {
  color: gray;
}

.goal-card-due {
  float: right;
  margin-right: 1rem;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-name {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .btn-display-type-transaction, .btn-display-type-selected-transaction {
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

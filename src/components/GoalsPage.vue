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
const goal_category_id = ref('');
const goal_name = ref('');
const goal_date = ref(new Date().toISOString().substr(0, 10));
const goal_amount = ref('');
const goal_is_spend = ref(true);
const show_add_goal_modal = ref(false);
const categories = ref([]);
const goals = ref([]);

onMounted(() => {
  get_categories_data();
  get_goals_data();
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

function delete_goal(id) {
  axios.delete('http://localhost:3000/delete_goal', {params  : {
    id: id
  }})
  .then(response => {
    get_goals_data();
  });
}

function get_category_name_by_id(id) {
  console.log(id);
  let elem = categories.value.find(category => category.id == id);
  if (elem != null) {
    return elem.name;
  }
}

function formatISODateToDateTime(isoDateString) {
  const dateTime = new Date(isoDateString);
  return format(dateTime, 'dd-MM-yyyy HH:mm');
}

</script>

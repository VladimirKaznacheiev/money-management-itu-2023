<template>
    <div class="container">
        <div>
            <h1 style="text-align: left; margin-left: 30px; margin-top: 30px; color: rgba(0,0,0,0.5);">
            Categories
            </h1>
        </div>
        <button class="btn btn-primary" type="submit" style="display: flex; align-items: center; margin-left: auto;margin-right: auto; font-size: 16px;" @click="show_add_category_modal = !show_add_category_modal">
            <span class="material-symbols-outlined">add</span>
            Add
        </button>
        <Modal name="m1" v-model:visible="show_add_category_modal" :maskClosable="false" :closable="false" :title="'Add category'" :cancelButton="{text: 'Cancel', onclick: () => {show_add_category_modal = !show_add_category_modal}, loading: false}" :okButton="{text: 'Add', onclick: () => {add_category();}, loading: false}">
            <div>
                <div class="form-group">
                    <div class="input-group my-3">
                        <input type="text" class="form-control" v-model="category_name" placeholder="Input category name" />
                    </div>
                </div>
                <div class="icon-selector">
                    <span v-for="(icon, index) in icons" :key="index" class="icon-circle" :class="{ 'selected': selectedIcon === icon }" @click="selectIcon(icon)">
                        <span class="material-symbols-outlined">
                            {{icon}}
                        </span>
                    </span>
                </div>
            </div>
        </Modal>  
        <div style="margin-left: 30px; margin-top: 20px;">
    <div class="row">
        <div class="col">
            <table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #000000;">
                <colgroup>
                    <col style="width: 90%; border-right: 1px solid #000000;">
                    <col style="width: 10%;">
                </colgroup>
                <thead>
                    <tr class="table-secondary">
                        <th scope="col" style="border-bottom: 1px solid #000000;">Name</th>
                        <th scope="col" style="border-bottom: 1px solid #000000;"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="category in categories" :key="category.id">
                        <td style="border-bottom: 1px solid #000000;">{{ category.name }}</td>
                        <td style="border-bottom: 1px solid #000000;"> 
                            <button style="background: none; border: none;"><span class="material-symbols-outlined" style="font-size: 18px; color: #71787E;">delete</span></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

    </div>
</template>

<style scoped>
.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  background-color: #fff;
  border: 2px solid #007bff; 
  transition: background-color 0.5s ease;

}

.icon-circle i {
  font-size: 20px;
}

.icon-circle.selected {
  background-color: #007bff;
  color: #fff;
}
</style>
<script setup>
import axios from 'axios';

import { Modal } from 'usemodal-vue3';

import { ref } from 'vue'


import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const category_name = ref('');

const categories = ref([]);
const show_add_category_modal = ref(false);
const icons = ["flight", "alarm", "cardiology","emoji_events","shopping_bag","account_balance","pedal_bike","menu_book",
"brush","directions_bus","cake","photo_camera","directions_car","pill","monetization_on",
"stadia_controller","credit_card","coffee","favorite","house", "checkroom", "trip", "smoking_rooms", "fitness_center", "wifi", "headphones", "ifl"];
const selectedIcon = ref(icons[0]);




function add_category() {
    show_add_category_modal.value = !show_add_category_modal.value;
    save_category_to_db();
}

function save_category_to_db() {
    axios.post('http://localhost:3000/add_category', null, {params  : { 
        name: category_name.value,
        icon_name: selectedIcon.value,
    }})
    .then(response => {
        get_categories_data();
    });
}

function get_categories_data() {

    axios.get('http://localhost:3000/get_categories')
        .then(response => {
            console.log(response)
            categories.value = response.data
        });

}
function selectIcon(icon) {
  selectedIcon.value = icon;
}





get_categories_data();

</script>
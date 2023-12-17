<template>
    <div class="container">
        <div>
            <h1 style="text-align: left; margin-left: 30px; margin-top: 30px; color: rgba(0,0,0,0.5);">
            Categories
            </h1>
        </div>
        <div class="display-type-buttons">
            <div class="display-type-buttons-container">
                <button type="button" style="font-size: 18px;" :class="[category_is_income_filt ? 'btn-display-type' : 'btn-display-type-selected']" @click="showExp(); selectedCat = null" >Expenses</button>
                <button type="button" style="font-size: 18px;" :class="[!category_is_income_filt ? 'btn-display-type' : 'btn-display-type-selected']" @click="showInc(); selectedCat = null" >Incomes</button>
            </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 20px">
            <button class="btn btn-primary" type="submit" style="display: flex; align-items: center; margin-left: 20px;margin-right: auto; font-size: 16px;" @click="show_add_category_modal = !show_add_category_modal; selectedCat = null;">
                <span class="material-symbols-outlined">add</span>
                Add new category
            </button>
            <Modal name="m1" v-model:visible="show_add_category_modal" :maskClosable="false" :closable="false" :title="'Add new category'" :cancelButton="{text: 'Cancel', onclick: () => {show_add_category_modal = !show_add_category_modal; selectedIcon = icons[0]; category_is_income = false; category_name = '';}, loading: false}" :okButton="{text: 'Add', onclick: () => {add_category(); selectedIcon = icons[0]; category_is_income = false;}, loading: false}">
              <div>
                <div class="display-type-buttons-transaction">
                    <div class="display-type-buttons-container-transaction">
                        <button type="button" :class="[!category_is_income ? 'btn-display-type-selected-transaction' : 'btn-display-type-transaction']" @click="category_is_income = false">Expense</button>
                        <button type="button" :class="[category_is_income ? 'btn-display-type-selected-transaction' : 'btn-display-type-transaction']" @click="category_is_income = true">Income</button>
                    </div>
                </div>
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
            <button type="button" style="display: flex; align-items: center; margin-left: auto;margin-right: 20px; font-size: 16px;" class="btn btn-danger" @click="deleteCategory">
                <span class="material-symbols-outlined">delete</span>Delete category
            </button>
        </div>  
        <div class="existing-categories">
            <div v-for="(category, index) in paginatedCategories" :key="index" class="existing-category">
                <div class="icon-circleBIG" :class="{ 'selected': selectedCat === category.name }" @click="selectCat(category.name)">
                    <span class="material-symbols-outlined">{{ category.iconName }}</span>
                </div>
                <div class="category-name">{{ category.name }}
                </div>
            </div>
        </div>
        <div class="pagination">
            <p class="pagination_text">Page {{currentPage}} / {{totalPages}}</p>
            <button @click="prevPage" :disabled="currentPage === 1" style="background: none; border: none; margin-right: 10px; font-size: 24px;">&lt;</button>
            <button @click="nextPage" :disabled="currentPage === totalPages" style="background: none; border: none; font-size: 24px;">&gt;</button>
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
.icon-circleBIG {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px; 
  height: 120px; 
  border-radius: 50%;
  cursor: pointer;
  background-color: #fff;
  border: 2px solid #007bff;
  transition: background-color 0.5s ease;
}
.icon-circleBIG span {
  font-size: 40px; 
}
.icon-circleBIG.selected {
  background-color: #007bff;
  color: #fff;
}

.icon-circleBIG i {
  font-size: 40px;
}
.icon-circle i {
  font-size: 20px;
}

.icon-circle.selected {
  background-color: #007bff;
  color: #fff;
}
.existing-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.existing-category {
  width: 18%; 
  box-sizing: border-box; 
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px; 
}

.existing-category .icon-circle {
  margin-bottom: 5px;
}

.existing-category .category-name {
  text-align: center;
  font-size: 22px;
  color: rgba(0, 0, 0, 0.7);
}

.existing-category .icon-circle.selected {
  background-color: #007bff;
  color: #fff;
}
.category-name {
  text-align: center;
  font-size: 16px; 
  color: rgba(0, 0, 0, 0.7);
  margin-top: 5px; 
}
.pagination {
    display: flex;
    float: right;
    justify-content: center;
    margin-bottom: 1vw;
    margin-right: 3vw;
}

.pagination_text {
    margin-right: 10px;
    margin-top: 15px;
    font-size: 16px;
    color: rgba(0,0,0,0.5);

}
</style>
<script setup>
import axios from 'axios';

import { Modal } from 'usemodal-vue3';

import { ref, computed } from 'vue'


import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const category_name = ref('');

const categories = ref([]);
const show_add_category_modal = ref(false);
const icons = ["flight", "alarm", "cardiology","emoji_events","shopping_bag","account_balance","pedal_bike","menu_book",
"brush","directions_bus","cake","photo_camera","directions_car","pill","monetization_on",
"stadia_controller","credit_card","coffee","favorite","house", "checkroom", "trip", "smoking_rooms", "fitness_center", "wifi", "headphones", "ifl"];
const selectedIcon = ref(icons[0]);
const selectedCat = ref(null);
const category_is_income = ref(false);
const category_is_income_filt = ref(false);



function add_category() {
    show_add_category_modal.value = !show_add_category_modal.value;
    save_category_to_db();

    category_name.value = '';
    selectedIcon.value = icons[0];
    transaction_is_income.value = false;
}

function save_category_to_db() {
    axios.post('http://localhost:3000/add_category', null, {params  : { 
        name: category_name.value,
        icon_name: selectedIcon.value,
        is_income: category_is_income.value
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
function selectCat(name) {
    if (selectedCat.value === name) {
    selectedCat.value = null;
  } else {
    selectedCat.value = name;
  }
}
const itemsPerPage = ref(15);
const currentPage = ref(1);

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value -= 1;
    }
};

const totalPages = computed(() => {
    return Math.ceil(filteredCategories.value.length / itemsPerPage.value);
});

function showExp() {
  category_is_income_filt.value = false;
  currentPage.value = 1;
}

function showInc() {
  category_is_income_filt.value = true;
  currentPage.value = 1;
}

const filteredCategories = computed(() => {
    return categories.value.filter(category => {
        return category.isIncome === category_is_income_filt.value;
    });
});

const paginatedCategories = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredCategories.value.slice(start, end);
});


function deleteCategory() {
  if (!selectedCat.value) {
    return;
  }

  const categoryId = categories.value.find(category => category.name === selectedCat.value)?.id;

  if (!categoryId) {
    return;
  }

  axios.delete(`http://localhost:3000/delete_category?id=${categoryId}`)
      .then(response => {
        console.log('Deleted category:', response.data);

        selectedCat.value = null;

        get_categories_data();
      })
      .catch(error => {
        console.error('Error deleting a category:', error);
      });
}

get_categories_data();

</script>
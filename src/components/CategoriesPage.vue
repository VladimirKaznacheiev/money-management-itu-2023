<!--
    Name: components/CategoriesPage.vue
    Authors: Volodymyr Burylov
             Volodymyr Kaznacheiev
             Maksim Kalutski
    Date: 05/12/2023
-->

<template>
  <div class="container">
    <div>
      <h1 class="title">Categories</h1>
    </div>
    <div class="display-type-buttons">
      <div class="display-type-buttons-container">
        <button type="button" class="btn-display-type"
                :class="[category_is_income_filt ? '' : 'btn-display-type-selected']"
                @click="showExp(); selectedCat = null">Expenses
        </button>
        <button type="button" class="btn-display-type"
                :class="[!category_is_income_filt ? '' : 'btn-display-type-selected']"
                @click="showInc(); selectedCat = null">Incomes
        </button>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-primary add-btn"
              @click="show_add_category_modal = !show_add_category_modal; selectedCat = null;">
        <span class="material-symbols-outlined">add</span>
        Add new category
      </button>
      <Modal name="m1" v-model:visible="show_add_category_modal" :maskClosable="false" :closable="false"
             :title="editCategoryId ? 'Edit category' : 'Add new category'"
             :cancelButton="{text: 'Cancel', onclick: () => {show_add_category_modal = !show_add_category_modal; selectedIcon = icons[0]; category_is_income = false; category_name = '';}, loading: false}"
             :okButton="{text: editCategoryId ? 'Save' : 'Add', onclick: () => {add_category(); selectedIcon = icons[0]; category_is_income = false;}, loading: false}">
        <div>
          <div class="display-type-buttons-transaction">
            <div class="display-type-buttons-container-transaction">
              <button type="button"
                      class="btn-display-type-transaction"
                      :class="[!category_is_income ? 'btn-display-type-selected-transaction' : '']"
                      @click="category_is_income = false">Expense
              </button>
              <button type="button"
                      class="btn-display-type-transaction"
                      :class="[category_is_income ? 'btn-display-type-selected-transaction' : '']"
                      @click="category_is_income = true">Income
              </button>
            </div>
          </div>
          <div class="form-group">
            <div class="input-group my-3">
              <input type="text" class="form-control" v-model="category_name" placeholder="Input category name"/>
            </div>
          </div>
          <div class="icon-selector">
            <span v-for="(icon, index) in icons" :key="index" class="icon-circle"
                  :class="{ 'selected': selectedIcon === icon }" @click="selectIcon(icon)">
              <span class="material-symbols-outlined">
                {{ icon }}
              </span>
            </span>
          </div>
        </div>
      </Modal>
      <button type="button" class="btn btn-danger delete-btn" @click="deleteCategory">
        <span class="material-symbols-outlined">delete</span>Delete category
      </button>
    </div>
    <div class="existing-categories">
      <div v-for="(category, index) in paginatedCategories" :key="index" class="existing-category">
        <div class="icon-circleBIG" :class="{ 'selected': selectedCat === category.name }"
             @click="selectCat(category.name)">
          <span class="material-symbols-outlined">{{ category.iconName }}</span>
        </div>
        <div class="category-name">{{ category.name }}</div>
        <button @click="editCategory(category.id)" class="edit-btn">
          <span class="material-symbols-outlined">edit</span>
        </button>
      </div>
    </div>
    <div class="pagination">
      <p class="pagination_text">Page {{ currentPage }} / {{ totalPages }}</p>
      <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">&lt;</button>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">&gt;</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import {Modal} from 'usemodal-vue3';
import {ref, computed} from 'vue';

const category_name = ref('');
const categories = ref([]);
const show_add_category_modal = ref(false);
const icons = [
  "flight", "alarm", "cardiology", "emoji_events", "shopping_bag", "account_balance", "pedal_bike", "menu_book",
  "brush", "directions_bus", "cake", "photo_camera", "directions_car", "pill", "monetization_on",
  "stadia_controller", "credit_card", "coffee", "favorite", "house", "checkroom", "trip", "smoking_rooms", "fitness_center", "wifi", "headphones", "ifl"
];
const selectedIcon = ref(icons[0]);
const selectedCat = ref(null);
const category_is_income = ref(false);
const category_is_income_filt = ref(false);

function add_category() {
  if (editCategoryId.value) {
    update_category(editCategoryId.value);
  } else {
    save_category_to_db();
  }

  editCategoryId.value = null;
  category_name.value = '';
  selectedIcon.value = icons[0];
  category_is_income.value = false;
  show_add_category_modal.value = false;
}

function save_category_to_db() {
  axios.post('http://localhost:3000/add_category', null, {
    params: {
      name: category_name.value,
      icon_name: selectedIcon.value,
      is_income: category_is_income.value
    }
  })
      .then(response => {
        get_categories_data();
      }).catch(error => {
    if (error.response && error.response.data && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert('An error occurred: ' + error.message);
    }
  });
}

function get_categories_data() {
  axios.get('http://localhost:3000/get_categories')
      .then(response => {
        categories.value = response.data;
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
        selectedCat.value = null;
        get_categories_data();
      })
      .catch(error => {
        console.error('Error deleting a category:', error);
      });
}

const editCategoryId = ref(null);

function editCategory(id) {
  editCategoryId.value = id;
  const selectedCategory = categories.value.find(category => category.id === id);

  // Populate the form fields with the selected category's data
  category_name.value = selectedCategory.name;
  selectedIcon.value = selectedCategory.iconName;
  category_is_income.value = selectedCategory.isIncome;

  // Open the modal
  show_add_category_modal.value = true;
}

function update_category(id) {
  axios.put('http://localhost:3000/edit_category', null, {
    params: {
      id: id,
      name: category_name.value,
      icon_name: selectedIcon.value,
      is_income: category_is_income.value
    }
  }).then(response => {
    show_add_category_modal.value = false;
    get_categories_data();
  }).catch(error => {
    if (error.response && error.response.data && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert('An error occurred: ' + error.message);
    }
  });
}

get_categories_data();
</script>

<style scoped>
.title {
  text-align: left;
  margin-left: 30px;
  margin-top: 30px;
  color: rgba(0, 0, 0, 0.5);
}

.display-type-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.display-type-buttons-container {
  display: flex;
  gap: 10px;
}

.btn-display-type {
  font-size: 18px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.5s ease;
}

.btn-display-type-selected {
  background-color: #C6E7FF;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.add-btn {
  display: flex;
  align-items: center;
  margin-left: 20px;
  font-size: 16px;
}

.delete-btn {
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 16px;
}

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

.icon-circle.selected {
  background-color: #007bff;
  color: #fff;
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

.icon-circleBIG.selected {
  background-color: #007bff;
  color: #fff;
}

.icon-circleBIG span {
  font-size: 40px;
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

.category-name {
  text-align: center;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.7);
  margin-top: 5px;
}

.edit-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #71787E;
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
  color: rgba(0, 0, 0, 0.5);
}

.page-btn {
  background: none;
  border: none;
  font-size: 24px;
}
</style>

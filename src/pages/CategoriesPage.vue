<template>
  <div class="container">
    <div class="actions">
      <DeleteButton :style="{ visibility: selectedCat ? 'visible' : 'hidden' }" @toggleModal="deleteCategory" />
      <div class="display-type-buttons">
        <div class="tabs">
          <input type="radio" id="radio-expenses" name="tabs" :checked="!category_is_income_filt" @change="showExp">
          <label class="tab" for="radio-expenses">Expenses</label>
          <input type="radio" id="radio-incomes" name="tabs" :checked="category_is_income_filt" @change="showInc">
          <label class="tab" for="radio-incomes">Incomes</label>
          <span class="glider"></span>
        </div>
      </div>
      <AddButton @toggleModal="show_add_category_modal = !show_add_category_modal; selectedCat = null" />
    </div>
    <Modal name="m1" v-model:visible="show_add_category_modal" :maskClosable="false" :closable="false"
           :title="editCategoryId ? 'Edit category' : 'Add new category'"
           :cancelButton="{text: 'Cancel', onclick: () => {resetForm()}, loading: false}"
           :okButton="{text: editCategoryId ? 'Save' : 'Add', onclick: () => {add_category()}, loading: false}">
      <div>
        <div class="modal-tabs">
          <div class="tabs">
            <input type="radio" id="modal-radio-expenses" name="modal-tabs" :checked="!category_is_income" @change="handleModalCategoryTypeChange(false)">
            <label class="tab" for="modal-radio-expenses">Expenses</label>
            <input type="radio" id="modal-radio-incomes" name="modal-tabs" :checked="category_is_income" @change="handleModalCategoryTypeChange(true)">
            <label class="tab" for="modal-radio-incomes">Incomes</label>
            <span class="glider"></span>
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
    <ExistingCategories
        :categories="categories"
        :selectedCat="selectedCat"
        :itemsPerPage="itemsPerPage"
        :currentPage="currentPage"
        :category_is_income_filt="category_is_income_filt"
        @selectCat="selectCat"
        @editCategory="editCategory"
    />
  </div>
  <Pagination :currentPage="currentPage" :totalPages="totalPages" :nextPage="nextPage" :prevPage="prevPage" />
</template>


<script setup>
import axios from 'axios';
import { Modal } from 'usemodal-vue3';
import { ref, computed } from 'vue';
import AddButton from '@/components/ui/AddButton.vue';
import DeleteButton from '@/components/ui/DeleteButton.vue';
import Pagination from '@/components/Pagination.vue'; // Import the Pagination component
import ExistingCategories from '@/components/ExistingCategories.vue'; // Import the new component

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
  resetForm();
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

const itemsPerPage = ref(28);
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

function handleModalCategoryTypeChange(new_value) {
  category_is_income.value = new_value;
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

function resetForm() {
  show_add_category_modal.value = !show_add_category_modal;
  selectedIcon.value = icons[0];
  category_is_income.value = false;
  category_name.value = '';
}

get_categories_data();
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-width: 700px;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.display-type-buttons {
  display: flex;
  justify-content: center;
  flex-grow: 1;
}

.modal-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  position: relative;
  background-color: #fff;
  padding: 0.4rem;
  border-radius: 99px;
}

.tabs * {
  z-index: 2;
}

.tabs input[type="radio"] {
  display: none;
}

.tab {
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
  transition: color 0.15s ease-in;
}

.tabs input[type="radio"]:checked + label {
  color: #185ee0;
}

.tabs input[id="radio-expenses"]:checked ~ .glider,
.tabs input[id="modal-radio-expenses"]:checked ~ .glider {
  transform: translateX(0);
}

.tabs input[id="radio-incomes"]:checked ~ .glider,
.tabs input[id="modal-radio-incomes"]:checked ~ .glider {
  transform: translateX(200px);
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

.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
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
</style>

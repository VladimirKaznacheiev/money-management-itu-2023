<template>
  <div class="existing-categories">
    <div v-for="(category, index) in paginatedCategories" :key="index" class="checkbox-wrapper-16">
      <label class="checkbox-wrapper">
        <input class="checkbox-input" type="checkbox" :checked="selectedCat === category.name" @change="selectCat(category.name)">
        <span class="checkbox-tile">
          <span class="checkbox-icon">
            <span class="material-symbols-outlined">{{ category.iconName }}</span>
          </span>
          <span class="checkbox-label">{{ category.name }}</span>
          <span class="edit-icon" @click.stop="editCategory(category.id)">
            <span class="material-symbols-outlined">edit</span>
          </span>
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  categories: Array,
  selectedCat: String,
  itemsPerPage: Number,
  currentPage: Number,
  category_is_income_filt: Boolean
});

const emit = defineEmits(['selectCat', 'editCategory']);

const filteredCategories = computed(() => {
  return props.categories.filter(category => {
    return category.isIncome === props.category_is_income_filt;
  });
});

const paginatedCategories = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return filteredCategories.value.slice(start, end);
});

function selectCat(name) {
  emit('selectCat', name);
}

function editCategory(id) {
  emit('editCategory', id);
}
</script>

<style scoped>
.checkbox-wrapper-16 *,
.checkbox-wrapper-16 *:after,
.checkbox-wrapper-16 *:before {
  box-sizing: border-box;
}

.checkbox-wrapper-16 .checkbox-input {
  clip: rect(0 0 0 0);
  -webkit-clip-path: inset(100%);
  clip-path: inset(100%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.checkbox-wrapper-16 .checkbox-input:checked + .checkbox-tile {
  border-color: #2260ff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  color: #2260ff;
}

.checkbox-wrapper-16 .checkbox-input:checked + .checkbox-tile:before {
  transform: scale(1);
  opacity: 1;
  background-color: #2260ff;
  border-color: #2260ff;
}

.checkbox-wrapper-16 .checkbox-input:checked + .checkbox-tile .checkbox-icon,
.checkbox-wrapper-16 .checkbox-input:checked + .checkbox-tile .checkbox-label {
  color: #2260ff;
}

.checkbox-wrapper-16 .checkbox-input:focus + .checkbox-tile {
  border-color: #2260ff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1), 0 0 0 4px #b5c9fc;
}

.checkbox-wrapper-16 .checkbox-input:focus + .checkbox-tile:before {
  transform: scale(1);
  opacity: 1;
}

.checkbox-wrapper-16 .checkbox-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 10rem;
  height: 7rem;
  border-radius: 1.5rem;
  border: 2px solid #b5bfd9;
  background-color: #fff;
  box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 3%);
  transition: 0.15s ease;
  cursor: pointer;
  position: relative;
}

.checkbox-wrapper-16 .checkbox-tile:hover {
  box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 10%);
}

.checkbox-wrapper-16 .checkbox-tile:before {
  content: "";
  position: absolute;
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #b5bfd9;
  background-color: #fff;
  border-radius: 50%;
  top: 0.5rem;
  left: 0.5rem;
  opacity: 0;
  transform: scale(0);
  transition: 0.25s ease;
}

.checkbox-wrapper-16 .checkbox-tile:hover:before {
  transform: scale(1);
  opacity: 1;
}

.checkbox-wrapper-16 .checkbox-icon {
  transition: 0.375s ease;
  color: #494949;
}

.checkbox-wrapper-16 .checkbox-icon .material-symbols-outlined {
  font-size: 3rem;
}

.checkbox-wrapper-16 .checkbox-label {
  color: #707070;
  transition: 0.375s ease;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  padding: 0 0.5rem;
}

.checkbox-wrapper-16 .edit-icon {
  position: absolute;
  right: 0.6rem;
  top: 0.6rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.checkbox-wrapper-16 .edit-icon:hover {
  color: #2260ff;
}

.checkbox-wrapper-16 .checkbox-tile:hover .edit-icon {
  opacity: 1;
}

.existing-categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  gap: 1.5rem;
}
</style>

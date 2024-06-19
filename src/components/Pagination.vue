<template>
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">&lt;</button>
    <p class="pagination_text">{{ currentPage }} / {{ totalPages }}</p>
    <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">&gt;</button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  nextPage: Function,
  prevPage: Function,
});
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.pagination_text {
  margin-top: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.5);
}

.pagination-button {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 0.5rem;
  padding-bottom: 1rem;
}

.pagination-button:disabled {
  color: #ccc;
  cursor: default;
}
</style>

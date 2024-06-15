<template>
  <div
      class="menu_button"
      @click="$emit('click')"
      :class="{ selected_menu_button: isSelected }"
  >
    <div class="menu_button_content">
      <span class="material-symbols-outlined">{{ icon }}</span>
      <div class="menu_button_text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  icon: String,
  text: String,
  isSelected: Boolean
});
</script>

<style scoped>
.menu_button {
  width: 95%;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 40px;
  transition: background-color 0.5s ease;
  display: flex;
  cursor: pointer;
}

.menu_button:hover {
  background-color: #d6eeff;
}

.selected_menu_button {
  background-color: #c6e7ff;
}

.menu_button_text {
  font-size: 1rem;
  font-weight: bold;
  margin-left: 0.8rem;
}

.menu_button_content {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}
</style>

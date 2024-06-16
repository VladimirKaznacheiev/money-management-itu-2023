<template>
  <div
      class="menu_button"
      @click="$emit('click')"
      :class="{ selected_menu_button: isSelected }"
  >
    <div class="menu_button_content">
      <span class="material-symbols-outlined">{{ icon }}</span>
      <transition name="fade">
        <div v-if="!isCollapsed" class="menu_button_text">{{ text }}</div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  icon: String,
  text: String,
  isSelected: Boolean,
  isCollapsed: Boolean
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
  align-items: center;
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
  align-items: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

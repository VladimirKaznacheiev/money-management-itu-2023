<template>
  <div :class="['left_navbar', { collapsed: isCollapsed }]">
    <div class="menu_buttons_block">
      <MenuButton
          v-for="(item, index) in menuItems"
          :key="index"
          :icon="item.icon"
          :text="item.text"
          :isSelected="currenyWindowState === item.state"
          :isCollapsed="isCollapsed"
          @click="updateState(item.state)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import MenuButton from '@/components/ui/MenuButton.vue';

const props = defineProps({
  currenyWindowState: Number,
  isCollapsed: Boolean,
});

const emit = defineEmits(['update:state', 'toggle-sidebar']);

const menuWindowStates = ref({
  dashboard: 0,
  transactions: 1,
  goals: 2,
  categories: 3,
});

const menuItems = [
  { icon: 'dashboard', text: 'Dashboard', state: menuWindowStates.value.dashboard },
  { icon: 'attach_money', text: 'Transactions', state: menuWindowStates.value.transactions },
  { icon: 'flag', text: 'Goals', state: menuWindowStates.value.goals },
  { icon: 'shopping_basket', text: 'Categories', state: menuWindowStates.value.categories },
];

const updateState = (state) => {
  emit('update:state', state);
};
</script>

<style scoped>
.left_navbar {
  background-color: #fff;
  width: 300px;
  padding: 1.5rem 1rem 0 1rem;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  position: fixed; /* Ensure the sidebar is fixed */
  top: 80px; /* Adjust this to the height of the navbar */
  bottom: 0;
  left: 0;
  overflow-y: auto;
  z-index: 1; /* Ensure the sidebar is below the navbar */
}

.left_navbar.collapsed {
  width: 95px;
}

.menu_buttons_block {
  width: 100%;
}
</style>


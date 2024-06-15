<template>
  <div :class="['left_navbar', { collapsed: isCollapsed }]">
    <div class="logo_container">
      <img class="logo" src="@/assets/logo.png" alt="SVG Image" />
      <div class="app_name" v-if="!isCollapsed">FinanSync</div>
    </div>
    <div class="menu_buttons_block">
      <MenuButton
          icon="dashboard"
          text="Dashboard"
          :isSelected="currenyWindowState === menuWindowStates.dashboard"
          @click="updateState(menuWindowStates.dashboard)"
      />
      <MenuButton
          icon="attach_money"
          text="Transactions"
          :isSelected="currenyWindowState === menuWindowStates.transactions"
          @click="updateState(menuWindowStates.transactions)"
      />
      <MenuButton
          icon="flag"
          text="Goals"
          :isSelected="currenyWindowState === menuWindowStates.goals"
          @click="updateState(menuWindowStates.goals)"
      />
      <MenuButton
          icon="shopping_basket"
          text="Categories"
          :isSelected="currenyWindowState === menuWindowStates.categories"
          @click="updateState(menuWindowStates.categories)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import MenuButton from '@/components/MenuButton.vue';

const props = defineProps({
  currenyWindowState: Number,
});

const emit = defineEmits(['update:state', 'toggle-sidebar']);

const menuWindowStates = ref({
  dashboard: 0,
  transactions: 1,
  goals: 2,
  categories: 3,
});

const updateState = (state) => {
  emit('update:state', state);
};

const isCollapsed = ref(false);

const handleToggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
.left_navbar {
  background-color: #e7e8eb;
  width: 15%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: start;
  transition: width 0.3s;
}

.collapsed {
  width: 5%;
}

.logo_container {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

.logo {
  width: 35%;
}

.app_name {
  font-size: 1.5rem;
  font-weight: bold;
}

.menu_buttons_block {
  margin-top: 5rem;
  width: 100%;
}
</style>

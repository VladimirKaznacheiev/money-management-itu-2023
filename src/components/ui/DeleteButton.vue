<!-- DeleteButton.vue -->
<template>
  <div class="delete-transaction-button">
    <button type="button" class="button" @click="toggleModal">
      <span class="button__text">Delete</span>
      <span class="button__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['toggleModal']);

function toggleModal() {
  emit('toggleModal');
}
</script>

<style scoped>
.delete-transaction-button {
  margin-left: auto;
  margin-right: 10px;
}

.button {
  position: relative;
  width: 130px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: none;
  background-color: #e44843;
  border-radius: 20px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
}

.button, .button__icon, .button__text {
  transition: all 0.3s;
}

.button .button__text {
  transform: translateX(25px);
  color: #fff;
  font-weight: 600;
}

.button .button__icon {
  position: absolute;
  transform: translateX(87px);
  height: 100%;
  width: 39px;
  background-color: #c9302c;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.button .svg {
  width: 30px;
  stroke: #fff;
}

.button:hover {
  background: #c9302c;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

.button:hover .button__text {
  color: transparent;
}

.button:hover .button__icon {
  width: 120px;
  transform: translateX(0);
}

.button:active .button__icon {
  background-color: #ac2925;
}

.button:active {
  background-color: #ac2925;
}
</style>

<template>
  <div class="add-transaction-button">
    <button type="button" class="button" @click="toggleModal">
      <span class="button__text">Add</span>
      <span class="button__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg">
          <line y2="19" y1="5" x2="12" x1="12"></line>
          <line y2="12" y1="12" x2="19" x1="5"></line>
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
.add-transaction-button {
  margin-left: auto;
  margin-right: 10px;
}

.button {
  position: relative;
  width: 120px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: none;
  background-color: #3aa856;
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
  transform: translateX(75px);
  height: 100%;
  width: 39px;
  background-color: #34974d;
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
  background: #34974d;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

.button:hover .button__text {
  color: transparent;
}

.button:hover .button__icon {
  width: 110px;
  transform: translateX(0);
}

.button:active .button__icon {
  background-color: #2e8644;
}

.button:active {
  background-color: #2e8644;
}
</style>

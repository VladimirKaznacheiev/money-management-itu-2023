<template>
  <div class="card-big">
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.card-big {
  background: #e8e8e8;
  border-radius: 1.5vw;
  margin-top: 2vw;
  text-align: left;
  box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 3%);
  width: 100%;
}

.card-content {
  padding: 1.5vw;
}

@media (max-width: 768px) {
  .card-big {
    margin-top: 4vw;
  }

  .card-content {
    padding: 3vw;
  }
}
</style>


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
  background: #E7E8EB;
  border-radius: 2vw;
  height: 70vh;
  margin-top: 2vw;
  margin-left: 3vw;
  margin-right: 3vw;
  text-align: left;
}

.card-content {
  margin-left: 2vw;
  padding-top: 0.5vw;
  padding-bottom: 0.5vw;
}
</style>

<template>
  <img style="width: 300px; height: 300px;" alt="Vue logo" src="./assets/money.png">
  <TestDatabasePage />
</template>

<script>
import TestDatabasePage from './components/TestDatabasePage.vue'

export default {
  name: 'App',
  components: {
    TestDatabasePage,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <div class="app">
    <div class="app__wrapper">
      <LeftBar class="app__leftbar"></LeftBar>
      <div class="app__body">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import LeftBar from '@/components/layout/LeftBar.vue'
</script>

<style scoped lang="scss">
.app {
  background-color: $bg;
  padding: 30px 0 0 0;
  min-height: 100vh;

  &__wrapper {
    display: flex;
    margin: 0 auto;
    max-width: 1300px;
  }

  &__leftbar {
    width: 23.5%;
    margin-right: 1.5%;
  }

  &__body {
    width: 75%;
    height: 100px;
    border-radius: 30px;
    background-color: $gray-000;
  }
}
</style>

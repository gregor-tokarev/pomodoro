<template>
  <div class="app">
    <div class="app__wrapper">
      <LeftBar class="app__leftbar"></LeftBar>
      <div class="app__body">
        <router-view #default="{Component}">
          <transition name="fade" mode="out-in">
            <component :is="Component"></component>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LeftBar from '@/components/layout/LeftBar.vue'
</script>

<style scoped lang="scss">
$page-padding-top: 30px;

.app {
  background-color: $bg;
  padding: $page-padding-top 0 0 0;
  overflow-y: hidden;
  min-height: 100vh;

  &__wrapper {
    display: flex;
    margin: 0 auto;
    max-width: 1300px;
  }

  &__leftbar {
    height: calc(100vh - #{$page-padding-top});
    min-width: 310px;
    width: 23.5%;
    margin-right: 1.5%;
  }

  &__body {
    max-height: calc(100vh - #{$page-padding-top});
    width: 75%;
    padding: 30px 40px;
    border-radius: 30px;
    background-color: $gray-000;
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>

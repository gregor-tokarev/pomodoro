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
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
onMounted(() => {
  store.dispatch('timerModule/fetchRecords')
})
</script>

<style scoped lang="scss">
$page-padding-top: 30px;

.app {
  min-height: 100vh;
  padding: $page-padding-top 0 0 0;
  overflow-y: hidden;
  background-color: $bg;

  &__wrapper {
    display: flex;
    max-width: 1300px;
    margin: 0 auto;
  }

  &__leftbar {
    width: 23.5%;
    min-width: 310px;
    height: calc(100vh - #{$page-padding-top});
    margin-right: 1.5%;
  }

  &__body {
    width: 75%;
    max-height: calc(100vh - #{$page-padding-top});
    padding: 30px 40px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: $gray-000;
    border-radius: 30px;
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

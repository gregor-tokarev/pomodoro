<template>
  <div class="app">
    <div class="app__wrapper">
      <LeftBar class="app__leftbar"></LeftBar>
      <div class="app__body">
        <router-view #default="{Component}">
          <suspense>
            <div>
              <component :is="Component"></component>
            </div>

            <template #fallback>
              <AppIcon class="app__loader" icon-name="loader" :color="Colors.ACCENT_MAIN"></AppIcon>
            </template>
          </suspense>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LeftBar from '@/components/layout/LeftBar.vue'
import { Colors } from '@/lib/UI/colors'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import AppIcon from '@/components/UI/AppIcon.vue'
import { timerObservable } from '@/lib/TimerObservable'

const store = useStore()
const loaded = ref<boolean>(false)
onMounted(async () => {
  await store.dispatch('timerModule/fetchActiveRecord')
  loaded.value = true

  if (!store.getters['timerModule/runningRecord']) {
    return
  }

  store.dispatch('timerModule/setupRunner')
  store.dispatch('timerModule/setupWorkListener')
  store.dispatch('timerModule/setupBreakListener')
})

async function timerStopHandler() {
  const audio = new Audio('/audio/door-bell.mp3')
  audio.volume = 0.3
  audio.play()
}

timerObservable.subscribeStop(timerStopHandler)

onBeforeUnmount(() => {
  store.commit('timerModule/CLEAR_HISTORY_LISTENERS')
  timerObservable.removeEventListener('stopTimer', timerStopHandler)
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
    position: relative;
    width: 75%;
    max-height: calc(100vh - #{$page-padding-top});
    padding: 30px 40px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: $gray-000;
    border-radius: 30px;
  }

  &__loader {
    position: absolute;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
    animation: spin 2s infinite linear;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
}
</style>

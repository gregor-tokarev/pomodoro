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
              <AppLoader class="app__loader"></AppLoader>
            </template>
          </suspense>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LeftBar from '@/components/layout/LeftBar.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { timerObservable, UpdateDetail } from '@/lib/TimerObservable'
import AppLoader from '@/components/UI/AppLoader.vue'
import { useI18n } from 'vue-i18n'

const store = useStore()
const loaded = ref<boolean>(false)
const { t } = useI18n()

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
  document.title = t('title')

  const audio = new Audio('/audio/door-bell.mp3')
  audio.volume = 0.3
  audio.play()
}

// eslint-disable-next-line no-undef
function timerUpdateHandler(event: CustomEventInit<UpdateDetail>) {
  document.title = event.detail?.timeStr ?? t('title')
}

function timerResetHandler() {
  document.title = t('title')
}

timerObservable.subscribeStop(timerStopHandler)
timerObservable.subscribeUpdate(timerUpdateHandler)
timerObservable.subscribeReset(timerResetHandler)

onBeforeUnmount(() => {
  store.commit('timerModule/CLEAR_HISTORY_LISTENERS')

  timerObservable.unsubscribe('timerStop', timerStopHandler)
  timerObservable.unsubscribe('timerReset', timerResetHandler)
  timerObservable.unsubscribe('timerUpdate', timerUpdateHandler)
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
  }
}
</style>
<i18n src="@/lang/base.json"></i18n>

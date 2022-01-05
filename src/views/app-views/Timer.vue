<template>
  <div class="timer">
    <div class="timer__inner">
      <div class="timer__col">
        <AppTimer :coveragePercent="55" time="12:43"></AppTimer>

        <AppButton class="timer__start">Start</AppButton>

        <div class="timer__settings">
          <div v-if="workOptions && workTime" class="timer__setting">
            <h4 class="subtitle-text timer__label">Work duration</h4>
            <AppSelect :options="workOptions" v-model="workTime"></AppSelect>
          </div>
          <div v-if="breakOptions && breakTime" class="timer__setting">
            <h4 class="subtitle-text timer__label">Break duration</h4>
            <AppSelect :options="breakOptions" v-model="breakTime"></AppSelect>
          </div>
        </div>
      </div>

      <div class="timer__col">
        <AppTodoItem
          v-for="task in tasks"
          :key="task.id"
          :todoitem="task"
        ></AppTodoItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import AppTimer from '@/components/UI/AppTimer.vue'
import { computed, onMounted } from 'vue'
import AppTodoItem from '@/components/UI/AppTodoItem.vue'
import { Task } from '../../../models/task.model'
import AppButton from '@/components/UI/AppButton.vue'
import AppSelect from '@/components/UI/AppSelect.vue'
import { TimerOptions } from '../../../models/settings/timer-options.model'

const store = useStore()
const tasks = computed<Task[]>(() => store.getters['tasksModule/tasksForTimer'])

const workTime = computed<string>({
  get(): string {
    return store.getters['settingsModule/userSettings'].workTime + ' min'
  },
  set(value): void {
    store.dispatch('settingsModule/updateUserSettings', {
      workTime: parseInt(value.split(' ')[0])
    })
  }
})
const breakTime = computed<string>({
  get(): string {
    return store.getters['settingsModule/userSettings'].breakTime + ' min'
  },
  set(value): void {
    store.dispatch('settingsModule/updateUserSettings', {
      breakTime: parseInt(value.split(' ')[0])
    })
  }
})

onMounted(async () => {
  await store.dispatch('tasksModule/fetchTasks', { limit: 5 })
})

const workOptions = computed<string[] | undefined>(
  () => (store.getters['settingsModule/timerOptions'] as TimerOptions)?.work?.map(entry => entry.time + ' min')
)
const breakOptions = computed<string[] | undefined>(
  () => (store.getters['settingsModule/timerOptions'] as TimerOptions)?.break?.map(entry => entry.time + ' min')
)
</script>

<style scoped lang="scss">
.timer {
  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__col {
    &:first-child {
      width: 400px;
    }

    &:last-child {
      width: 45%;
    }
  }

  &__start {
    width: 100%;
    margin: 20px 0 30px;
  }

  &__setting {
    margin-top: 30px;
  }

  &__label {
    color: $gray-400;
  }
}
</style>

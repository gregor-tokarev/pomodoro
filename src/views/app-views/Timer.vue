<template>
  <div class="timer">
    <div class="timer__inner">
      <div class="timer__col">
        <AppTimer :progress-percent="currentPercent" :time="currentTime"></AppTimer>

        <div class="timer__actions">
          <AppButton @click="startTimer" :disabled="store.getters['timerModule/isRunning']"
                     class="timer__start timer__button">Start
          </AppButton>
          <AppButton @click="resetTimer" style-type="light" class="timer__button">Reset</AppButton>
        </div>

        <div class="timer__settings">
          <div v-if="workTime" class="timer__setting">
            <h4 class="subtitle-text timer__label">Work duration</h4>
            <AppSelect :disabled="store.getters['timerModule/isRunning']" :options="workOptions"
                       v-model="workTime"></AppSelect>
          </div>
          <div v-if="breakTime" class="timer__setting">
            <h4 class="subtitle-text timer__label">Break duration</h4>
            <AppSelect :disabled="store.getters['timerModule/isRunning']" :options="breakOptions"
                       v-model="breakTime"></AppSelect>
          </div>
        </div>
      </div>

      <div class="timer__col">
        <AppTodoItem
          v-for="task in tasks"
          :key="task.id"
          :in-progress="store.getters['tasksModule/runningTaskId'] === task.id"
          :todoitem="task"
        ></AppTodoItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import AppTimer from '@/components/UI/AppTimer.vue'
import { computed, onMounted, ref } from 'vue'
import AppTodoItem from '@/components/UI/AppTodoItem.vue'
import { Task } from '../../../models/task.model'
import AppButton from '@/components/UI/AppButton.vue'
import AppSelect from '@/components/UI/AppSelect.vue'
import { TimerOptions } from '../../../models/settings/timer-options.model'
import { UserSettings } from '../../../models/settings/user-settings.model'

const store = useStore()
const tasks = computed<Task[]>(() => store.getters['tasksModule/tasksForTimer'])
onMounted(async () => {
  await store.dispatch('tasksModule/fetchTasks')
})

// ====
// Timer
const currentTime = computed<string>(() => store.getters['timerModule/timeFormatted'])
const currentPercent = computed<number>(() => store.getters['timerModule/completionPercent'])

const isRunning = ref<boolean>(false)
if (store.getters['timerModule/runningRecord']) {
  isRunning.value = true
}

async function startTimer(): Promise<void> {
  await store.dispatch('timerModule/startTimer')
  isRunning.value = true
}

async function resetTimer(): Promise<void> {
  await store.dispatch('timerModule/resetTimer')
  isRunning.value = false
}

// ====
// Options
const workOptions = computed<string[] | undefined>(
  () => (store.getters['settingsModule/timerOptions'] as TimerOptions)?.work?.map(entry => entry.time + ' min')
)
const breakOptions = computed<string[] | undefined>(
  () => (store.getters['settingsModule/timerOptions'] as TimerOptions)?.break?.map(entry => entry.time + ' min')
)
const workTime = computed<string>({
  get(): string {
    const userSettings = store.getters['settingsModule/userSettings'] as UserSettings
    return userSettings ? userSettings.workTime + ' min' : ''
  },
  set(value): void {
    store.dispatch('settingsModule/updateUserSettings', {
      workTime: parseInt(value.split(' ')[0])
    })
  }
})
const breakTime = computed<string>({
  get(): string {
    const userSettings = store.getters['settingsModule/userSettings'] as UserSettings
    return userSettings ? userSettings.breakTime + ' min' : ''
  },
  set(value): void {
    store.dispatch('settingsModule/updateUserSettings', {
      breakTime: parseInt(value.split(' ')[0])
    })
  }
})

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

  &__actions {
    display: flex;
    margin: 20px 0 30px;
  }

  &__button {
    flex-grow: 1;
  }

  &__start {
    margin-right: 20px;
  }

  &__setting {
    margin-top: 30px;
  }

  &__label {
    color: $gray-400;
  }
}
</style>

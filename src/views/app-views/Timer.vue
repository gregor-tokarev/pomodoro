<template>
  <div class="timer">
    <div class="timer__inner">
      <div class="timer__col">
        <AppTimer :progress-percent="currentPercent" :time="currentTime"></AppTimer>

        <div class="timer__actions">
          <AppButton @click="startTimer" class="timer__start timer__button">Start</AppButton>
          <AppButton @click="resetTimer" style-type="light" class="timer__button">Reset</AppButton>
        </div>

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
import { computed, onMounted, ref } from 'vue'
import AppTodoItem from '@/components/UI/AppTodoItem.vue'
import { Task } from '../../../models/task.model'
import AppButton from '@/components/UI/AppButton.vue'
import AppSelect from '@/components/UI/AppSelect.vue'
import { TimerOptions } from '../../../models/settings/timer-options.model'
import { HistoryRecord } from '../../../models/history-record.model'
import { secondsToTime } from '@/lib/secondsToTime'
import { getTimeStr } from '@/lib/getTimeStr'

const store = useStore()
const tasks = computed<Task[]>(() => store.getters['tasksModule/tasksForTimer'])
onMounted(async () => {
  await store.dispatch('tasksModule/fetchTasks')
})

// ====
// Timer
const currentTime = ref<string>('')
const currentPercent = ref<number>(0)

function timeStr() {
  if (!store.getters['timerModule/runningRecord']) {
    return ''
  }

  const time = secondsToTime(store.getters['timerModule/timeOffset'])
  return getTimeStr(time)
}

function progressPercent() {
  const runningRecord: HistoryRecord = store.getters['timerModule/runningRecord']
  if (!runningRecord) {
    return 0
  }

  const totalTimeMinutes: number = runningRecord.isBreak
    ? store.getters['settingsModule/userSettings'].breakTime
    : store.getters['settingsModule/userSettings'].workTime

  const passedTimeMinutes: number = Math.floor(store.getters['timerModule/timeOffset'] / 60)
  return (passedTimeMinutes / totalTimeMinutes) * 100
}

function setTime() {
  currentTime.value = timeStr()
  currentPercent.value = progressPercent()
}

setInterval(setTime, 1000)

const isRunning = ref<boolean>(false)

async function startTimer(): Promise<void> {
  await store.dispatch('timerModule/startTimer')
  isRunning.value = true
  setTime()
}

async function resetTimer(): Promise<void> {
  await store.dispatch('timerModule/resetTimer')
  isRunning.value = false
  setTime()
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

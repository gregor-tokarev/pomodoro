<template>
  <div class="history-item" :class="{'history-item--break': props.record.isBreak}">
    <div class="basic-text history-item__info" @click="isTasksOpen = !isTasksOpen">
      <div class="history-item__circle"></div>
      <div class="history-item__duration">
        {{ duration.minutes }} min
      </div>
      <div class="basic-text history-item__time">
        <span class="time-entry">{{ timeStart }}</span> - <span class="time-entry">{{ timeEnd }}</span>
      </div>

      <!-- right side -->
      <div v-if="!props.record.isBreak" class="history-item__tasks">
        completed tasks: <span class="history-item__tasks-count">{{ props.tasks.length }}</span>
      </div>
      <div v-else class="history-item__break">break</div>
    </div>
    <expand-transition>
      <div v-if="isTasksOpen && !props.record.isBreak" class="history-item__elements">
        <div class="basic-text todo history-item__todo" v-for="task in props.tasks" :key="task.id">
          <div class="todo__text">{{ task.text }}</div>
          <div class="todo__time">
            <span class="time-entry">{{ dayjs(task.timeCompleted).format('hh:mm') }}</span>
          </div>
        </div>
      </div>
    </expand-transition>
  </div>
</template>

<script lang="ts" setup>
import { HistoryRecord } from '../../../models/history-record.model'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { diffDates } from '@/lib/diffDates'
import { secondsToTime, Time } from '@/lib/secondsToTime'
import { Task } from '../../../models/task.model'
import ExpandTransition from '@/components/utils/expand-transition.vue'

interface Props {
  record: HistoryRecord
  tasks: Task[]
}

const props = defineProps<Props>()
const timeStart = computed<string>(() => {
  const date = dayjs(props.record.timeStart)
  return date.format('HH:mm')
})

const timeEnd = computed<string>(() => {
  const date = dayjs(props.record.timeEnd)
  return date.format('HH:mm')
})

const duration = computed<Time>(() => {
  const diff = diffDates(props.record.timeStart, props.record.timeEnd, 'second')

  return secondsToTime(diff)
})

const isTasksOpen = ref<boolean>(false)
</script>

<style scoped lang="scss">
$padding-x: 15px;

.history-item {
  border-bottom: 1px solid $gray-300;

  &--break {
    .history-item__info {
      cursor: default;
    }

    .history-item__circle {
      background-color: $gray-300;
    }

    .history-item__duration {
      color: $gray-300;
    }

    .history-item__time {
      color: $gray-300;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    padding: 20px $padding-x;
    cursor: pointer;
  }

  &__circle {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    background-color: $accent-main;
    border-radius: 50%;
  }

  &__duration {
    color: $accent-main;
  }

  &__time {
    width: 160px;
    margin-left: auto;
    color: $gray-400;
  }

  &__tasks {
    width: 175px;
    color: $gray-400;
    cursor: pointer;
  }

  &__tasks-count {
    color: $accent-main;
  }

  &__break {
    color: $gray-300;
  }

  &__todo {
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 20px;
    }
  }
}

.time-entry {
  display: inline-block;
  width: 55px;

  &:last-child {
    text-align: right;
  }
}

.todo {
  display: flex;
  align-items: center;
  padding: 0 $padding-x 0 $padding-x + 40px;
  color: $gray-400;

  &__time {
    width: 160px;
    margin-left: auto;
  }

  &__duration {
    width: 175px;
  }
}
</style>
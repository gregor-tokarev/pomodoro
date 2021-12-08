<template>
  <div class="history-item" :class="{'history-item--break': props.history.isBreak}">
    <div class="basic-text history-item__info">
      <div class="history-item__circle"></div>
      <div class="history-item__duration">
        {{ duration.minutes }} min
      </div>
      <div class="basic-text history-item__time">
        {{ timeStart }} - {{ timeEnd }}
      </div>

      <!-- right side -->
      <div v-if="!props.history.isBreak" class="history-item__tasks">
        completed tasks: <span class="history-item__tasks-count">{{ props.history.tasks.length }}</span>
      </div>
      <div v-else class="history-item__break">break</div>
    </div>
    <div class="history-item__elements">
      <div class="todo history-item__todo" v-for="task in tasks" :key="task.id">
        <div class="todo__text">{{ task.text }}</div>
        <div class="todo__time">{{ task.timeStart }} - {{ task.timeEnd }}</div>
        <!--        <div class="todo__duration"></div>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nanoid } from 'nanoid'
import { History } from '../../../models/history.model'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { diffDates } from '@/assets/ts/diffDates'
import { secondsToTime, Time } from '@/assets/ts/secondsToTime'
import { Todo } from '../../../models/todo.model'

interface Props {
  history: History
}

const props = defineProps<Props>()
const timeStart = computed<string>(() => {
  const date = dayjs(props.history.timeStart)
  return date.format('HH:mm')
})

const timeEnd = computed<string>(() => {
  const date = dayjs(props.history.timeEnd)
  return date.format('HH:mm')
})

const duration = computed<Time>(() => {
  const diff = diffDates(props.history.timeStart, props.history.timeEnd, 'second')

  return secondsToTime(diff)
})

const ownerId = nanoid()
// todo remove it's hard code
const tasks = ref<Todo[]>([
  {
    id: nanoid(),
    text: 'some',
    status: 'completed',
    timeStart: '2021-12-07T15:00:55+0300',
    timeEnd: '2021-12-07T15:15:56+0300',
    ownerId
  },
  {
    id: nanoid(),
    text: 'some',
    status: 'completed',
    timeStart: '2021-12-07T15:00:55+0300',
    timeEnd: '2021-12-07T15:15:56+0300',
    ownerId
  },
  {
    id: nanoid(),
    text: 'some',
    status: 'completed',
    timeStart: '2021-12-07T15:00:55+0300',
    timeEnd: '2021-12-07T15:15:56+0300',
    ownerId
  }
])
</script>

<style scoped lang="scss">
$padding-x: 15px;

.history-item {
  border-bottom: 1px solid $gray-300;

  &--break {
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
    padding: $padding-x 20px;
  }

  &__circle {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 50%;
    background-color: $accent-main;
  }

  &__duration {
    min-width: 60px;
    margin-right: 13px;
    color: $accent-main;
  }

  &__time {
    color: $gray-400;
  }

  &__tasks {
    margin-left: auto;
    color: $gray-400;
  }

  &__tasks-count {
    color: $accent-main;
  }
}

.todo {
  display: flex;
  align-items: center;
  padding: 0 0 0 $padding-x + 40px;

  &__time {
    margin-left: auto;
  }
}
</style>

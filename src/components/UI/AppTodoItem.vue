<template>
  <div
    class="todo-item"
    :class="{
      'todo-item--inprogress': props.todoitem.status === 'inprogress'
    }"
  >
    <AppCheckbox
      class="todo-item__checkbox"
      :modelValue="props.todoitem.status === 'completed'"
    ></AppCheckbox>
    <div class="basic-text todo-item__text">{{ props.todoitem.text }}</div>

    <div class="hint-text todo-item__time">
      {{ time }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppCheckbox from '@/components/UI/AppCheckbox.vue'
import { Task } from 'models/task.model'
import { computed, ref } from 'vue'
import { diffDates } from '@/assets/ts/diffDates'
import { secondsToTime } from '@/assets/ts/secondsToTime'
import { getTimeStr } from '@/assets/ts/getTimeStr'
import RelativeTime from 'dayjs/plugin/relativeTime'
import dayjs, { Dayjs } from 'dayjs'

interface Props {
  todoitem: Task
}

const props = defineProps<Props>()

dayjs.extend(RelativeTime)

const currentTime = ref<Dayjs>(dayjs())
setInterval(() => {
  currentTime.value = dayjs()
}, 1000)

const time = computed<string>(() => {
  const timeEnd = props.todoitem.timeEnd ?? currentTime.value.format()
  const diff = diffDates(props.todoitem.timeStart, timeEnd, 'second')

  const res = secondsToTime(diff)
  return getTimeStr(res)
})
</script>

<style scoped lang="scss">
.todo-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px 15px;
  border-bottom: 1px solid $gray-300;

  &--inprogress {
    background-color: $accent-light;
    border-bottom-color: $accent-main;

    .todo-item__time {
      color: $accent-main;
    }

    :deep(.checkbox) {
      border-color: $accent-main;
    }
  }

  &__text {
    color: $gray-400;
  }

  &__checkbox {
    margin-right: 20px;
  }

  &__time {
    position: absolute;
    right: 0;
    bottom: 0;
    color: $gray-400;
  }
}
</style>

<template>
  <div
    ref="root"
    v-click-outside="clickOutsideConfig"
    class="todo-item"
    :class="{
      'todo-item--inprogress': props.todoitem.status === 'inprogress'
    }"
  >
    <AppIcon
      v-if="props.isDraggable"
      @contextmenu="isContextmenu = true"
      @mousedown="isContextmenu = false"
      :color="Colors.GRAY_200"
      icon-name="drag-dots"
      class="todo-item__drag"
    ></AppIcon>

    <AppCheckbox
      class="todo-item__checkbox"
      :modelValue="props.todoitem.status === 'completed'"
    ></AppCheckbox>
    <div class="basic-text todo-item__text">{{ props.todoitem.text }}</div>

    <div v-if="time" class="hint-text todo-item__time">
      {{ time }}
    </div>

    <AppContextMenu v-model="isContextmenu">
      <li class="hint-text context-menu__item">
        <AppIcon :color="Colors.GRAY_300" icon-name="order-up"></AppIcon>
        Sort up
      </li>
      <li class="hint-text context-menu__item">
        <AppIcon :color="Colors.GRAY_300" icon-name="order-down"></AppIcon>
        Sort down
      </li>
      <li @click="emit('delete', props.todoitem.id)" class="hint-text context-menu__item context-menu__item--error">
        <AppIcon :color="Colors.SYSTEM_ERROR" icon-name="basket"></AppIcon>
        Delete
      </li>
    </AppContextMenu>
  </div>
</template>

<script lang="ts" setup>
import { Colors } from '@/lib/UI/colors'
import AppCheckbox from '@/components/UI/AppCheckbox.vue'
import { Task } from 'models/task.model'
import { computed, ref } from 'vue'
import { diffDates } from '@/lib/diffDates'
import { secondsToTime } from '@/lib/secondsToTime'
import { getTimeStr } from '@/lib/getTimeStr'
import RelativeTime from 'dayjs/plugin/relativeTime'
import dayjs, { Dayjs } from 'dayjs'
import AppIcon from '@/components/UI/AppIcon.vue'
import AppContextMenu from '@/components/UI/AppContextMenu.vue'

interface Props {
  todoitem: Task,
  isDraggable: boolean
}

const props = withDefaults(defineProps<Props>(), {
  todoitem: undefined,
  isDraggable: false
})
const emit = defineEmits<{ (e: 'delete', value: string): void }>()

const root = ref<HTMLElement>()

dayjs.extend(RelativeTime)
const currentTime = ref<Dayjs>(dayjs())

if (props.todoitem.timeStart) {
  setInterval(() => {
    currentTime.value = dayjs()
  }, 1000)
}

const time = computed<string | undefined>(() => {
  const timeEnd = props.todoitem.timeEnd ?? currentTime.value.format()
  if (!props.todoitem.timeStart) {
    return
  }
  const diff = diffDates(props.todoitem.timeStart, timeEnd, 'second')

  const res = secondsToTime(diff)
  return getTimeStr(res)
})

const isContextmenu = ref<boolean>(false)
const clickOutsideConfig = {
  handler() {
    isContextmenu.value = false
  },
  events: ['click', 'contextmenu']
}
</script>

<style scoped lang="scss">
.todo-item {
  position: relative;
  display: flex;
  align-items: center;
  background-color: $gray-000;
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

  &.draggable-source--is-dragging {
    border: 2px dashed $accent-main;
    background-color: $accent-light;
  }

  &__drag {
    cursor: pointer;
    margin-right: 10px;
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

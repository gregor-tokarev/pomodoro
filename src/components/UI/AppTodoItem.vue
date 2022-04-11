<template>
  <div
    ref="root"
    @contextmenu="isContextmenu = true"
    v-click-outside="clickOutsideConfig"
    class="todo-item"
    :class="{
      'todo-item--inprogress': props.inProgress
    }"
  >
    <AppIcon
      v-if="props.isDraggable"
      @mousedown="isContextmenu = false"
      :color="props.inProgress ? Colors.ACCENT_MAIN : Colors.GRAY_200"
      icon-name="drag-dots"
      class="todo-item__drag"
    ></AppIcon>

    <AppCheckbox
      class="todo-item__checkbox"
      v-model="isCompleted"
    ></AppCheckbox>

    <textarea
      rows="1"
      :readonly="!props.canEdit"
      v-autogrow
      class="basic-text todo-item__text"
      v-model.lazy="text"
      @focus.prevent
      @keydown.enter.exact.prevent="saveText($event.currentTarget.value)"
    ></textarea>

    <time v-if="props.todoitem.status === 'completed'" class="hint-text todo-item__time">
      {{ time }}
    </time>

    <AppContextMenu class="todo-item__context-menu" v-if="props.canEdit" v-model="isContextmenu"
                    container-selector=".app__body">
      <li v-if="props.todoitem.order !== minOrder" @click="changeOrder('up')"
          class="hint-text context-menu__item">
        <AppIcon :color="Colors.GRAY_300" icon-name="order-up"></AppIcon>
        Sort up
      </li>
      <li v-if="props.todoitem.order !== maxOrder" @click="changeOrder('down')"
          class="hint-text context-menu__item">
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
import { Task, taskStatus } from 'models/task.model'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import AppIcon from '@/components/UI/AppIcon.vue'
import AppContextMenu from '@/components/UI/AppContextMenu.vue'
import { useStore } from 'vuex'

interface Props {
  todoitem: Task
  isDraggable: boolean
  canEdit: boolean
  inProgress: boolean
}

const props = withDefaults(defineProps<Props>(), {
  todoitem: undefined,
  isDraggable: false,
  canEdit: false,
  inProgress: false
})
const emit = defineEmits<{
  (e: 'delete', value: string): void
  (e: 'changeOrder', value: { taskId: string, newOrder: number }): void
  (e: 'changeText', value: { taskId: string, text: string }): void
  (e: 'changeStatus', value: { taskId: string, status: taskStatus }): void
}>()

const root = ref<HTMLElement>()
const store = useStore()

// ====
// time
const time = computed<string | undefined>(() => {
  if (!props.todoitem.timeCompleted) {
    return
  }

  return dayjs(props.todoitem.timeCompleted.toDate()).format('hh:mm')
})

// ====
// context menu
const isContextmenu = ref<boolean>(false)
const clickOutsideConfig = {
  handler() {
    isContextmenu.value = false
  },
  events: ['click', 'contextmenu']
}

function changeOrder(direction: 'up' | 'down'): void {
  emit('changeOrder', {
    taskId: props.todoitem.id,
    newOrder: direction === 'down' ? props.todoitem.order + 1 : props.todoitem.order - 1
  })

  isContextmenu.value = false
}

const minOrder = store.getters['tasksModule/getMinOrderValue']
const maxOrder = store.getters['tasksModule/getMaxOrderValue']

// ====
// text
const textarea = computed<HTMLTextAreaElement | null | undefined>(() => root.value?.querySelector('textarea'))
const text = computed<string>({
  get(): string {
    return props.todoitem.text
  },
  set(value: string): void {
    saveText(value)
  }
})

function saveText(text: string): void {
  emit('changeText', {
    text,
    taskId: props.todoitem.id
  })

  textarea.value?.blur()
}

// ====
// status
const isCompleted = computed<boolean>({
  get(): boolean {
    return props.todoitem.status === 'completed'
  },
  set(value: boolean): void {
    const status = value ? 'completed' : 'todo'

    if (
      props.inProgress ||
      status === 'todo' // if it's moving to todo state allow
    ) {
      emit('changeStatus', {
        taskId: props.todoitem.id,
        status
      })
    }
  }
})
</script>

<style scoped lang="scss">
.todo-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 20px 15px;
  background-color: $gray-000;
  border-bottom: 1px solid $gray-300;

  &--inprogress {
    background-color: $accent-light;
    border-bottom-color: $accent-main;

    .todo-item__time {
      color: $accent-main;
    }

    .todo-item__text {
      background-color: $accent-light;
    }

    :deep(.checkbox) {
      border-color: $accent-main;

      &:hover {
        border-color: $accent-hover;
      }
    }
  }

  &.draggable-source--is-dragging {
    background-color: $accent-light;
    border: 2px dashed $accent-main;
  }

  &__drag {
    margin-top: 5.5px;
    margin-right: 10px;
    cursor: pointer;
  }

  &__text {
    width: 100%;
    margin-top: 3px;
    color: $gray-400;
    outline: none;
    border: none;
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

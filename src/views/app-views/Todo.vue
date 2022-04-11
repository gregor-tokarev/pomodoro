<template>
  <div class="todo" ref="root">
    <Sortable
      class="todo__list"
      @dragEnd="dragEnd"
      dragged-element=".todo__item"
      handle-selector=".todo-item__drag"
    >
      <li class="todo__item" tabindex="-1" :data-no-drag="task.status === 'completed' ? true : undefined"
          v-for="task in tasks"
          :key="task.id">
        <div class="todo__item-overlay"></div>
        <AppTodoItem
          is-draggable
          @delete="deleteTask"
          can-edit
          :in-progress="store.getters['tasksModule/runningTaskId'] === task.id"
          @changeText="changeText($event.taskId, $event.text)"
          @changeOrder="changeOrder($event.taskId, $event.newOrder)"
          @changeStatus="changeStatus($event.taskId, $event.status)"
          :todoitem="task"
        ></AppTodoItem>
      </li>
    </Sortable>

    <AppAddButton v-if="!isAddForm" class="todo__add-button" @click="toggleForm(true)">
      {{ t('addTask') }}
    </AppAddButton>

    <form v-else class="todo__add-form" @submit.prevent="addTask">
      <AppTextarea :placeholder="t('taskPlaceholder')"
                   data-task-input
                   v-model="taskForm.text"
                   @keydown.esc="isAddForm = false"
                   @keydown.enter.exact.prevent="addTask"></AppTextarea>

      <div class="todo__form-actions">
        <AppButton :disabled="v.text.$invalid">{{ t('addTask') }}</AppButton>
        <AppButton
          type="button"
          style-type="ghost"
          class="todo__cancel-button"
          @click="toggleForm(false)"
        >
          {{ t('cancel') }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'
import { useStore } from 'vuex'
import { Task, taskStatus } from '../../../models/task.model'
import AppTodoItem from '@/components/UI/AppTodoItem.vue'
import AppAddButton from '@/components/UI/AppAddButton.vue'
import AppTextarea from '@/components/UI/AppTextarea.vue'
import AppButton from '@/components/UI/AppButton.vue'
import type { SortableStopEvent } from '@shopify/draggable'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import Sortable from '@/components/utils/Sortable.vue'
import firebase from 'firebase/compat'

const { t } = useI18n()
const store = useStore()

// ====
// tasks
await store.dispatch('tasksModule/fetchTasks')

// const showCompleted = ref<boolean>(cacheValue)
// watchEffect(() => {
//   localStorage.setItem('showCompletedTask', String(showCompleted.value))
// })

const tasks = computed<Task[]>(() => store.getters['tasksModule/tasks'])

// ====
// Add-task form
const root = ref<HTMLElement>()
const isAddForm = ref<boolean>(false)

async function toggleForm(value: boolean): Promise<void> {
  isAddForm.value = value
  await nextTick()

  if (value) {
    const textarea = root.value?.querySelector('[data-task-input] textarea') as HTMLTextAreaElement
    // eslint-disable-next-line no-unused-expressions
    textarea?.focus()
  }
}

const taskForm = ref<{ text: string }>({
  text: ''
})
const v = useVuelidate({
  text: { required }
}, taskForm)

// ====
// task CRUD
function addTask(): void {
  if (v.value.$invalid) {
    return
  }

  store.dispatch('tasksModule/addTask', taskForm.value)
  taskForm.value.text = ''

  if (!root.value || !root.value.parentElement) {
    return
  }

  const parent = root.value.parentElement
  if (parent.clientHeight < parent.scrollHeight) {
    parent.scrollTo(0, 1000000)
  }
}

async function deleteTask(taskId: string): Promise<void> {
  await store.dispatch('tasksModule/deleteTask', taskId)
}

function changeStatus(taskId: string, status: taskStatus): void {
  const changes: Partial<Task> = {
    status
  }
  if (status === 'completed') {
    changes.timeCompleted = firebase.firestore.Timestamp.now()
  } else {
    changes.timeCompleted = null
  }

  store.dispatch('tasksModule/editTask', {
    id: taskId,
    changes
  })
}

function changeText(taskId: string, newText: string): void {
  store.dispatch('tasksModule/editTask', {
    id: taskId,
    changes: { text: newText }
  })
}

// ====
// task change order
function dragEnd(event: SortableStopEvent): void {
  const startIndex = store.getters['tasksModule/getMinOrderValue']

  if (event.newIndex === event.oldIndex) return

  const task = tasks.value.find(task => task.order === event.oldIndex + startIndex)
  if (!task) return

  store.dispatch('tasksModule/changeTaskOrder', {
    newOrder: startIndex + event.newIndex,
    taskId: task.id
  })
}

function changeOrder(taskId: string, newOrder: number): void {
  store.dispatch('tasksModule/changeTaskOrder', {
    newOrder: newOrder,
    taskId
  })
}
</script>

<style scoped lang="scss">
.todo {
  &__toggle-completed {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: $gray-400;
  }

  &__toggle-button {
    margin-right: 10px;
  }

  &__item {
    position: relative;

    &.draggable-mirror {
      z-index: 2;
    }

    &.draggable-source--is-dragging .todo__item-overlay {
      display: block;
    }
  }

  &__item-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: none;
    background-color: $accent-light;
    border: 2px dashed $accent-main;
  }

  &__add-form {
    margin-top: 20px;
  }

  &__add-button {
    margin: 10px 0 0 15px;
  }

  &__form-actions {
    margin-top: 15px;
  }

  &__cancel-button {
    margin-left: 10px;
  }
}
</style>

<i18n>
{
  "en": {
    "addTask": "Add Task",
    "cancel": "Cancel",
    "taskPlaceholder": "Task text"
  },
  "ru": {
    "addTask": "Добавить задание",
    "cancel": "Закрыть",
    "taskPlaceholder": "Название задачи"
  }
}
</i18n>

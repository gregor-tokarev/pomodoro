<template>
  <div class="todo" ref="root">
    <Sortable class="todo__list" @dragEnd="dragEnd" handleSelector=".todo-item__drag">
      <li class="todo__item" v-for="task in tasks" :key="task.id">
        <div class="todo__item-overlay"></div>
        <AppTodoItem is-draggable @delete="deleteTask" @changeOrder="changeOrder($event.taskId, $event.newOrder)"
                     :todoitem="task"></AppTodoItem>
      </li>
    </Sortable>

    <AppAddButton v-if="!isAddForm" class="todo__add-button" @click="toggleForm(true)">
      {{ t('addTask') }}
    </AppAddButton>

    <form v-else class="todo__add-form" @submit.prevent="addTask">
      <AppTextarea :placeholder="t('taskPlaceholder')" v-model="taskForm.text"
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
import { computed, nextTick, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Task } from '../../../models/task.model'
import AppTodoItem from '@/components/UI/AppTodoItem.vue'
import AppAddButton from '@/components/UI/AppAddButton.vue'
import AppTextarea from '@/components/UI/AppTextarea.vue'
import AppButton from '@/components/UI/AppButton.vue'
import { SortableStopEvent } from '@shopify/draggable'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import Sortable from '@/components/utils/Sortable.vue'

const { t } = useI18n()
const store = useStore()

onMounted(async () => {
  await store.dispatch('tasksModule/fetchTasks')
})
const tasks = computed<Task[]>(() => {
  return store.getters['tasksModule/tasks']
})

const root = ref<HTMLElement>()
const isAddForm = ref<boolean>(false)

async function toggleForm(value: boolean): Promise<void> {
  isAddForm.value = value
  await nextTick()

  if (value) {
    // eslint-disable-next-line no-unused-expressions
    root.value?.querySelector('textarea')?.focus()
  }
}

const taskForm = ref<{ text: string }>({
  text: ''
})
const v = useVuelidate({
  text: { required }
}, taskForm)

function addTask(): void {
  if (v.value.$invalid) {
    return
  }

  store.dispatch('tasksModule/addTask', taskForm.value)
  taskForm.value.text = ''

  const parent = root.value!.parentElement!
  if (parent.clientHeight < parent.scrollHeight) {
    parent.scrollTo(0, 1000000)
  }
}

async function deleteTask(taskId: string): Promise<void> {
  await store.dispatch('tasksModule/deleteTask', taskId)
}

function changeOrder(taskId: string, newOrder: number): void {
  store.dispatch('tasksModule/changeTaskOrder', {
    newOrder,
    taskId
  })
}

function dragEnd(event: SortableStopEvent): void {
  console.log(event.oldIndex, event.newIndex)
  // store.dispatch('tasksModule/changeTaskOrder', {newOrder: event.newIndex, taskId})
}
</script>

<style scoped lang="scss">
.todo {
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

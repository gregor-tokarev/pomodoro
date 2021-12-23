<template>
  <div class="todo" ref="root">
    <h1 class="title-text">Todo</h1>
    <ul class="todo__list">
      <li class="todo__item">
        <AppTodoItem v-for="task in tasks" :key="task.id" :todoitem="task"></AppTodoItem>
      </li>
    </ul>

    <AppAddButton v-if="!isAddForm" class="todo__add-button" @click="toggleForm(true)">
      {{ t('addTask') }}
    </AppAddButton>

    <form v-else class="todo__add-form" @submit.prevent="addTask">
      <AppTextarea :placeholder="t('taskPlaceholder')" v-model="taskForm.text"
                   @keydown.enter.exact="addTask"></AppTextarea>

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
import { ITask } from '../../../models/task.model'
import AppTodoItem from '@/components/UI/AppTodoItem.vue'
import AppAddButton from '@/components/UI/AppAddButton.vue'
import AppTextarea from '@/components/UI/AppTextarea.vue'
import AppButton from '@/components/UI/AppButton.vue'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const { t } = useI18n()
const store = useStore()

onMounted(async () => {
  await store.dispatch('tasksModule/fetchTasks')
})
const tasks = computed<ITask>(() => {
  return store.getters['tasksModule/tasks']
})

const root = ref<HTMLElement>()
const isAddForm = ref<boolean>(false)
const textarea = computed<HTMLTextAreaElement>(() => root.value!.querySelector('textarea')!)

async function toggleForm(value: boolean): Promise<void> {
  isAddForm.value = value
  await nextTick()

  if (value) {
    console.log(textarea.value)
    textarea.value.focus()
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
}
</script>

<style scoped lang="scss">
.todo {
  &__add-button {
    margin-top: 10px;
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

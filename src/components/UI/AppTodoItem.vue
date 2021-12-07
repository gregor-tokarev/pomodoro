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

    <div
      v-if="props.todoitem.status !== 'todo'"
      class="hint-text todo-item__time"
    >
      {{ props.todoitem.time }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppCheckbox from '@/components/UI/AppCheckbox.vue'
import { Todo } from 'models/todo.model'

interface Props {
  todoitem: Todo
}

const props = defineProps<Props>()
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

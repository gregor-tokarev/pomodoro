<template>
  <AppButton>some</AppButton>
  <AppInput placeholder="some"></AppInput>

  <AppCheckbox modelValue></AppCheckbox>

  <AppAddButton>Add task</AppAddButton>

  <AppTodoItem :todoitem="{text: 'some', status: 'todo', time: '12:12'}"></AppTodoItem>

  <AppHistoryItem></AppHistoryItem>
</template>

<script lang="ts" setup>
import AppButton from '@/components/UI/AppButton.vue'
import AppInput from '@/components/UI/AppInput.vue'
import AppCheckbox from '@/components/UI/AppCheckbox.vue'
import AppAddButton from '@/components/UI/AppAddButton.vue'
import AppTodoItem from '@/components/UI/AppTodoItem.vue'
import AppHistoryItem from '@/components/UI/AppHistoryItem.vue'
</script>

<style scoped lang="scss">

</style>

<template>
  <AppButton>some</AppButton>
  <AppInput placeholder="some"></AppInput>

  <AppCheckbox modelValue></AppCheckbox>

  <AppAddButton>Add task</AppAddButton>

  <AppTodoItem
    :todoitem="{
      text: 'some',
      status: 'completed',
      timeStart: '2021-12-07T15:00:55+0300',
      timeEnd: '2021-12-07T15:15:56+0300',
    }"
  ></AppTodoItem>

  <AppHistoryItem
    :history="{
      isBreak: false,
      timeStart: '2021-12-07T15:00:55+0300',
      timeEnd: '2021-12-07T15:23:55+0300',
      tasks: []
    }"
  ></AppHistoryItem>

  <AppTextarea placeholder="some"></AppTextarea>

  <AppSelect style="margin-top: 10px;" v-model="selectValue" :options="selectOptions" placeholder="some"></AppSelect>

  <AppTimer time="12:43" :coveragePercent="50"></AppTimer>
</template>

<script lang="ts" setup>
import AppButton from '@/components/UI/AppButton.vue'
import AppInput from '@/components/UI/AppInput.vue'
import AppCheckbox from '@/components/UI/AppCheckbox.vue'
import AppAddButton from '@/components/UI/AppAddButton.vue'
import AppTodoItem from '@/components/UI/AppTodoItem.vue'
import AppHistoryItem from '@/components/UI/AppHistoryItem.vue'
import AppTextarea from '@/components/UI/AppTextarea.vue'
import AppSelect from '@/components/UI/AppSelect.vue'
import { ref } from 'vue'
import AppTimer from '@/components/UI/AppTimer.vue'

const selectOptions = ref<string[]>(['some1', 'some2', 'some3'])
const selectValue = ref<string>()
</script>

<template>
  <div class="timer">
    <h1 class="title-text">Timer</h1>
    <AppTimer :coveragePercent="55" time="12:43"></AppTimer>

    <AppButton @click="addTask">Add task</AppButton>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import AppTimer from '@/components/UI/AppTimer.vue'
import AppButton from '@/components/UI/AppButton.vue'
import { onMounted } from 'vue'

const store = useStore()

onMounted(async () => {
  await store.dispatch('tasksModule/fetchTasks')
})

function addTask(): void {
  store.dispatch('tasksModule/addTask')
}
</script>

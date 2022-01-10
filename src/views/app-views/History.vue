<template>
  <div class="history">
    <template v-if="store.getters['tasksModule/tasks'].length">
      <ul class="history__list">
        <li v-for="(records, date, index) in historyBucketsArr" class="history__block" :key="index">
          <div class="tag subtitle-text history__date">
            {{ date }}
          </div>
          <AppHistoryRecord
            class="history__record"
            v-for="record in records"
            :key="record.id"
            :record="record"
            :tasks="store.getters['tasksModule/tasksInHistoryInterval'](record.id)"
          ></AppHistoryRecord>
        </li>
      </ul>

    </template>
  </div>
</template>

<script lang="ts" setup>
import AppHistoryRecord from '@/components/UI/AppHistoryRecord.vue'
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import { HistoryRecord } from '../../../models/history-record.model'

const store = useStore()

onMounted(async () => {
  await store.dispatch('tasksModule/fetchTasks')
})

type historyBuckets = { [key: string]: HistoryRecord[] }
const historyBucketsArr = computed<historyBuckets>(
  () => {
    const history = store.getters['timerModule/allFinishedRecords'] as HistoryRecord[]

    return history.reduce((acc: historyBuckets, record) => {
      const date = record.timeStart.split('T')[0]

      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(record)

      return acc
    }, {})
  }
)
</script>

<style scoped lang="scss">
.history {
  &__block {
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }

  &__date {
    margin: 0 0 10px;
    align-self: center;
  }

  &__record {
    &:last-child {
      border-bottom-color: transparent;
    }
  }
}
</style>

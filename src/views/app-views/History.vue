<template>
  <div class="history">
    <template v-if="store.getters['timerModule/allFinishedRecords'].length">
      <ul class="history__list">
        <li v-for="({date, records}, index) in historyBucketsArr" class="history__block" :key="index">
          <div class="tag subtitle-text history__date">
            {{ dayjs(date).format('DD MMMM') }}
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

      <AppLoader v-if="loading" class="history__loader"></AppLoader>
    </template>
    <h1 v-else class="subtitle-text history__empty">No records are found, start timer to create them</h1>
  </div>
</template>

<script lang="ts" setup>
import AppHistoryRecord from '@/components/UI/AppHistoryRecord.vue'
import { useStore } from 'vuex'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { HistoryRecord } from '../../../models/history-record.model'
import dayjs from 'dayjs'
import AppLoader from '@/components/UI/AppLoader.vue'

const store = useStore()

// ====
// pagination
const pageSize = 15
const page = ref<number>(1)
const loading = ref<boolean>(false)

async function loadHistory(): Promise<void> {
  loading.value = true
  const records = store.getters['timerModule/allFinishedRecords']

  const recordIndex = (page.value - 1) * pageSize - 1
  await store.dispatch('timerModule/fetchRecords', {
    limit: pageSize,
    timeStartPoint: page.value === 1 ? null : records[recordIndex]?.timeStart
  })

  page.value++
  loading.value = false
}

await loadHistory()

const bodyEl = computed<HTMLElement | null>(() => document.querySelector('.app__body'))

function scrollHandler() {
  if (!bodyEl.value) {
    return
  }
  const scrollBottom = bodyEl.value.scrollHeight - (bodyEl.value.scrollTop + bodyEl.value.clientHeight)

  if (scrollBottom < 20 && !loading.value) {
    loadHistory()
  }
}

onMounted(() => {
  bodyEl.value?.addEventListener('scroll', scrollHandler)
})

onUnmounted(() => {
  bodyEl.value?.removeEventListener('scroll', scrollHandler)
})
// ====
// bucketing
type bucket = {
  [key: string]: HistoryRecord[]
}
type historyBuckets = { records: HistoryRecord[], date: string }[]
const historyBucketsArr = computed<historyBuckets>(
  () => {
    const history = store.getters['timerModule/allFinishedRecords'] as HistoryRecord[]

    const buckets = history
      .reduce((acc: bucket, record) => {
        const date = dayjs(record.timeStart.toDate()).format().split('T')[0]

        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(record)

        return acc
      }, {})

    const bucketsArr: historyBuckets = []
    for (const bucket in buckets) {
      bucketsArr.push({
        date: bucket,
        records: buckets[bucket]
      })
    }
    bucketsArr.sort((prev, next) => {
      const prevDate = dayjs(prev.date)
      const nextDate = dayjs(next.date)
      return nextDate.diff(prevDate, 'day')
    })

    return bucketsArr
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

  &__empty {
    color: $gray-400;
  }

  &__loader {
    margin-top: 20px;
  }
}
</style>

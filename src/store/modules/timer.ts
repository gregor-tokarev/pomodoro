import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store'
import { HistoryRecord } from '../../../models/history-record.model'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import { firestore } from '@/lib/firebase'
import { secondsToTime } from '@/lib/secondsToTime'
import { getTimeStr } from '@/lib/getTimeStr'

export interface TimerState {
  records: HistoryRecord[]
}

const state: TimerState = {
  records: []
}

const mutations: MutationTree<TimerState> = {
  ADD_RECORD(state, record: HistoryRecord) {
    state.records.push(record)
  },
  SET_HISTORY(state, records: HistoryRecord[]) {
    state.records = records
  },
  FINISH_RECORD(state, {
    recordId,
    endTime
  }: { recordId: string, endTime: string }) {
    const record = state.records.find(record => record.id === recordId)
    if (record) {
      record.timeEnd = endTime
    }
  },
  DELETE_RECORD(state, recordId) {
    const recordIndex = state.records.findIndex(record => record.id === recordId)
    state.records.splice(recordIndex, 1)
  }
}

const actions: ActionTree<TimerState, RootState> = {
  async fetchRecords({
    commit,
    rootGetters
  }): Promise<HistoryRecord[]> {
    try {
      const userId = rootGetters['authModule/userId']
      const query = firestore.collection('history').where('ownerId', '==', userId)

      const { docs } = await query.get()
      const history: HistoryRecord[] = docs.map(doc => ({
        ...doc.data() as Omit<HistoryRecord, 'id'>,
        id: doc.id
      }))

      commit('SET_HISTORY', history)
      return history
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async startTimer({
    commit,
    rootGetters
  }): Promise<HistoryRecord> {
    try {
      const recordId = nanoid()
      const historyRecord: Omit<HistoryRecord, 'id' | 'timeEnd'> = {
        isBreak: false,
        ownerId: rootGetters['authModule/userId'],
        timeStart: dayjs().format()
      }

      await firestore.collection('history').doc(recordId).set(historyRecord)

      const record = { id: recordId, ...historyRecord }
      commit('ADD_RECORD', record)
      return record
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async finishTimer({
    commit,
    getters
  }, recordId: string): Promise<HistoryRecord> {
    try {
      const recordRef = firestore.collection('history').doc(recordId)
      const endTime = dayjs().format()

      await recordRef.update({ timeEnd: endTime })
      commit('FINISH_RECORD', {
        recordId,
        endTime
      })

      return getters.recordById(recordId)
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async resetTimer({
    commit,
    getters
  }): Promise<void> {
    const runningRecord = getters.runningRecord
    if (!runningRecord) {
      throw new Error('Timer is not running')
    }

    try {
      const recordRef = firestore.collection('history').doc(runningRecord.id)

      await recordRef.delete()
      commit('DELETE_RECORD', runningRecord.id)
    } catch (err) {
      console.error(err)
    }
  }
}

const getters: GetterTree<TimerState, RootState> = {
  recordById(state): (recordId: string) => HistoryRecord | undefined {
    return recordId => state.records.find(record => record.id === recordId)
  },
  runningRecord(state): HistoryRecord | undefined {
    return state.records.find(record => record.timeStart && !record.timeEnd)
  },
  timeOffset(state, getters): number | undefined {
    if (!getters.runningRecord) {
      return
    }

    const now = dayjs()
    const start = getters.runningRecord.timeStart

    return now.diff(start, 'second')
  },
  timeOffsetFormatted(state, getters): string {
    if (!getters['timerModule/runningRecord']) {
      return ''
    }

    const time = secondsToTime(getters['timerModule/timeOffset'])
    return getTimeStr(time)
  },
  timeOffsetString(state, getters): string | undefined {
    if (!getters.runningRecord) {
      return
    }

    const time = secondsToTime(getters.timeOffset)
    return getTimeStr(time)
  }
}

export const timerModule: Module<TimerState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
